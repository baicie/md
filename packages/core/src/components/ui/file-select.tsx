import { useState } from 'react'

import type { FileNode } from '@/platform/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlatform } from '@/hooks/use-platform'

interface FileSelectorProps {
  onSelect?: (files: FileNode[]) => void
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

  const handleClick = async () => {
    try {
      setLoading(true)
      const files = await platform.fs?.readDirs()

      if (files) {
        onSelect?.(files)
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
