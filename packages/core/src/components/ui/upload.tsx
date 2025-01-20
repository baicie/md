import * as React from 'react'

import { Button } from './button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'
import { Icon } from './icon'

import { cn } from '@/lib/utils'

interface UploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string
  description?: string
  multiple?: boolean
  directory?: boolean
  onFileSelect?: (files: File[]) => void
  onDirectorySelect?: (handle: FileSystemDirectoryHandle) => void
  className?: string
}

export function Upload({
  title = '上传文件',
  description = '拖拽文件到此处或点击选择',
  multiple = false,
  directory = false,
  onFileSelect,
  onDirectorySelect,
  className,
  ...props
}: UploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      onFileSelect?.(files)
    },
    [onFileSelect],
  )

  const handleFileSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      onFileSelect?.(files)
    },
    [onFileSelect],
  )

  const handleDirectorySelect = React.useCallback(async () => {
    try {
      const handle = await window.showDirectoryPicker()
      onDirectorySelect?.(handle)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to select directory:', e)
    }
  }, [onDirectorySelect])

  return (
    <Card
      className={cn(
        'w-full transition-colors',
        isDragging && 'border-primary',
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Icon name="AArrowDown" className="h-12 w-12 text-muted-foreground" />
        <div className="flex gap-2">
          {!directory && (
            <>
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                选择文件
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple={multiple}
                onChange={handleFileSelect}
                {...props}
              />
            </>
          )}
          {directory && (
            <Button onClick={handleDirectorySelect}>选择文件夹</Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {multiple ? '支持多文件上传' : '单文件上传'}
      </CardFooter>
    </Card>
  )
}
