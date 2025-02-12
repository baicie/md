import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useFileStorageStrategy } from './file-strategy'

import type { FileNode, FileTypeNode } from '@/platform/types'
import type { Editor } from '@tiptap/core'
import type { ReactNode } from 'react'

import { usePlatform } from '@/hooks/use-platform'
import { stringToUint8Array } from '@/lib/string-unit8'

interface FileContextType {
  files: FileNode[]
  setFiles: (files: FileNode[]) => void
  setActiveFile: (file: FileTypeNode) => void
  isLoading: boolean
  activeFile: FileTypeNode | undefined
  handleSave: () => Promise<void>
  handleFileSelect: (
    selectedFiles: FileNode[],
    selectedPath: string | null,
  ) => Promise<void>
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
  const { logger } = usePlatform()
  const [error, setError] = useState<Error | null>(null)
  const [files, setFiles] = useState<FileNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFile, setActiveFile] = useState<FileTypeNode>()
  const strategy = useFileStorageStrategy()

  const handleFileSelect = useCallback(
    async (selectedFiles: FileNode[], selectedPath: string | null) => {
      try {
        setIsLoading(true)
        logger.debug('开始保存文件...', { count: selectedFiles.length })

        // 立即更新UI
        setFiles(selectedFiles)

        // 异步保存文件
        await strategy.saveFiles(selectedFiles, selectedPath)
        logger.debug('文件保存成功')
      } catch (error) {
        logger.error('保存文件失败:', error)
        // 如果保存失败，回滚状态
        setFiles([])
      } finally {
        setIsLoading(false)
      }
    },
    [strategy, logger],
  )

  const handleSave = useCallback(async () => {
    if (activeFile && editor) {
      const text = editor.getText()
      await strategy.saveFile({
        ...activeFile,
        content: stringToUint8Array(text),
      })
    }
  }, [activeFile, editor, strategy])

  useEffect(() => {
    let mounted = true

    const initFiles = async () => {
      if (!mounted) return

      try {
        setIsLoading(true)
        const loadedFiles = await strategy.loadFiles()
        if (mounted) {
          setFiles(loadedFiles)
          logger.debug('文件加载成功', { count: loadedFiles.length })
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
