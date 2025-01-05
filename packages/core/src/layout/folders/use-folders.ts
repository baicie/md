import { fileApi } from '@/service/modules/files'
import { useContextMenu } from './use-context-menu'
import { useCallback, useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import type { FileItem } from '@/service/modules/files/types'

export const useFolders = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [defaultMenuItems, setDefaultMenuItems] = useState<MenuProps['items']>(
    [],
  )
  const { getMenuItems } = useContextMenu()

  const getFiles = useCallback(async () => {
    const { data } = await fileApi.getFiles()
    setFiles(data)
  }, [])

  useEffect(() => {
    setDefaultMenuItems(getMenuItems())
    getFiles()
  }, [])

  return {
    defaultMenuItems,
    files,
    getFiles,
  }
}
