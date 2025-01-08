import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('Editor Basic Functions', () => {
  let editor: Editor

  // 每个测试前创建编辑器实例
  beforeEach(() => {
    editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Hello World</p>',
    })
  })

  // 每个测试后销毁编辑器
  afterEach(() => {
    editor.destroy()
  })

  // 测试基础文本编辑
  it('should handle basic text editing', () => {
    editor.commands.setContent('<p>New content</p>')
    expect(editor.getHTML()).toBe('<p>New content</p>')
  })

  // 测试文本格式化
  it('should handle text formatting', () => {
    editor.commands.selectAll()
    editor.commands.setBold()
    expect(editor.getHTML()).toBe('<p><strong>Hello World</strong></p>')
  })

  // 测试撤销/重做
  it('should handle undo/redo', () => {
    const originalContent = editor.getHTML()
    editor.commands.setContent('<p>Changed content</p>')
    editor.commands.undo()
    expect(editor.getHTML()).toBe(originalContent)
    editor.commands.redo()
    expect(editor.getHTML()).toBe('<p>Changed content</p>')
  })

  // 测试列表功能
  it('should handle lists', () => {
    editor.commands.toggleBulletList()
    expect(editor.getHTML()).toContain('<ul>')
    expect(editor.getHTML()).toContain('<li>')
  })

  // 测试标题功能
  it('should handle headings', () => {
    editor.commands.setHeading({ level: 1 })
    expect(editor.getHTML()).toBe('<h1>Hello World</h1>')
  })

  // 测试链接功能
  it('should handle links', () => {
    editor.commands.selectAll()
    editor.commands.setLink({ href: 'https://example.com' })
    expect(editor.getHTML()).toBe(
      '<p><a href="https://example.com">Hello World</a></p>',
    )
  })

  // 测试快捷键
  it('should handle keyboard shortcuts', () => {
    // 模拟 Ctrl+B 快捷键
    editor.commands.selectAll()
    editor.commands.toggleBold()
    expect(editor.getHTML()).toBe('<p><strong>Hello World</strong></p>')
  })

  // 测试内容更新事件
  it('should handle content updates', () => {
    let updated = false
    editor.on('update', () => {
      console.log('baicieup')

      updated = true
    })

    editor.commands.setContent('<p>Updated content</p>')
    expect(updated).toBe(true)
  })

  // 测试选区变化
  it('should handle selection changes', () => {
    editor.commands.setTextSelection(0)
    expect(editor.state.selection.from).toBe(1)
  })

  // 测试内容验证
  it('should validate content', () => {
    const invalidContent = '<script>alert("xss")</script>'
    editor.commands.setContent(invalidContent)
    expect(editor.getHTML()).not.toContain('<script>')
  })
})
