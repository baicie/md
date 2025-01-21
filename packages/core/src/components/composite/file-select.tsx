import { omit } from 'lodash'
import { useState } from 'react'

import type { FileNode } from '@/platform/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlatform } from '@/hooks/use-platform'

interface FileSelectorProps {
  onSelect?: (files: FileNode[], filteredFiles: Partial<FileNode>[]) => void
  multiple?: boolean
  accept?: Record<`${string}/${string}`, `.${string}`[]>
  description?: string
}

export function FileSelector({
  onSelect,
  accept: _ = {
    'text/plain': ['.txt', '.md'],
    'application/json': ['.json'],
  },
  description = '选择文件',
}: FileSelectorProps) {
  const platform = usePlatform()
  const [loading, setLoading] = useState(false)

  const filterFileNode = (node: FileNode): Partial<FileNode> => {
    const filtered = omit(node, ['raw', 'content'])
    if (node.type === 'directory' && node.children) {
      return {
        ...filtered,
        children: node.children.map(
          filterFileNode as (node: Partial<FileNode>) => Partial<FileNode>,
        ),
      }
    }
    return filtered
  }

  const handleClick = async () => {
    try {
      setLoading(true)
      const files = await platform.fs?.readDirs()

      if (files) {
        const filteredFiles = files.map((file) => filterFileNode(file))
        onSelect?.(files, filteredFiles)
      }
      platform.logger.debug('files', files)
    } catch (e) {
      platform.logger.error('Failed to select files:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{description}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleClick} disabled={loading}>
          {loading ? '选择中...' : '选择文件'}
        </Button>
      </CardContent>
    </Card>
  )
}
