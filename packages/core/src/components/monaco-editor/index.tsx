import { Editor as MonacoEditor } from '@monaco-editor/react'
import { useEffect, useRef } from 'react'

import highlight from '@/lib/highlight'

interface SourceEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  height?: string | number
}

export const SourceEditor = ({
  value,
  onChange,
  language = 'html',
  theme = 'vs',
  height = '300px',
}: SourceEditorProps) => {
  const editorRef = useRef<unknown>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // 更新预览
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = highlight(value)
    }
  }, [value, language])

  // Monaco Editor 配置
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor

    // 配置编辑器
    editor.updateOptions({
      minimap: { enabled: false },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      fontSize: 14,
      tabSize: 2,
    })
  }

  return (
    <div className="source-editor-container">
      <div className="editor-wrapper">
        <MonacoEditor
          height={height}
          language={language}
          theme={theme}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  )
}
