import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useFileStorageStrategy } from './file-strategy'

import type { FileNode, FileTypeNode, ReadDirResult } from '@/platform/types'
import type { Editor } from '@tiptap/core'
import type { ReactNode } from 'react'

import { usePlatform } from '@/hooks/use-platform'

interface FileContextType {
  files: FileNode[]
  setFiles: (files: FileNode[]) => void
  setActiveFile: (file: FileTypeNode) => void
  isLoading: boolean
  activeFile: FileTypeNode | undefined
  handleSave: () => void
  handleFileSelect: (result: ReadDirResult) => Promise<void>
  editor: Editor | null
  error: Error | null
  setError: (error: Error | null) => void
}

const FileContext = createContext<FileContextType | null>(null)

interface FileContextProps {
  children: ReactNode
  editor: Editor | null
}

export const FileProvider = ({ children, editor }: FileContextProps) => {
  const { logger, toast } = usePlatform()
  const [error, setError] = useState<Error | null>(null)
  const [files, setFiles] = useState<FileNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFile, setActiveFile] = useState<FileTypeNode>()
  const strategy = useFileStorageStrategy()

  const handleFileSelect = useCallback(
    async (result: ReadDirResult) => {
      try {
        setIsLoading(true)
        setFiles(result.tree)
        await strategy.saveFiles(result)
      } catch (error) {
        logger.error('保存文件失败:', error)
        setFiles([])
      } finally {
        setIsLoading(false)
      }
    },
    [strategy, logger],
  )

  const handleSave = useCallback(() => {
    if (activeFile && editor) {
      const newContent = editor.getText()
      strategy
        .saveFile(activeFile.path, newContent)
        .then(() => {
          toast.success('保存成功')
        })
        .catch((e) => {
          toast.error('保存失败', e)
        })
    }
  }, [activeFile, editor, strategy, toast])

  useEffect(() => {
    let mounted = true

    const initFiles = async () => {
      if (!mounted) return

      try {
        setIsLoading(true)
        const filesTree = await strategy.loadFilesTree()
        if (mounted) {
          setFiles(filesTree)
          logger.debug('文件加载成功', { count: filesTree.length })
        }
      } catch (error) {
        logger.error('加载文件失败:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initFiles()

    return () => {
      mounted = false
    }
  }, [strategy, logger])

  return (
    <FileContext.Provider
      value={{
        files,
        isLoading,
        activeFile,
        editor,
        error,
        setError,
        setFiles,
        handleSave,
        handleFileSelect,
        setActiveFile,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export const useFiles = () => {
  const context = useContext(FileContext)
  if (!context) {
    throw new Error('useFiles must be used within FileProvider')
  }
  return context
}
