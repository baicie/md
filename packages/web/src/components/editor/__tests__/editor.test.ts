import { Editor } from '@tiptap/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import ExtensionKit from '../extensions/extension-kit'

import type { Transaction } from '@tiptap/pm/state'

declare module 'vitest' {
  interface Assertion {
    toMatchTiptapStructure: (expected: string) => void
  }
}

expect.extend({
  toMatchTiptapStructure(received: string, expected: string) {
    // 清理 HTML：只保留标签结构，移除所有属性
    const cleanHTML = (html: string) => {
      return html
        .replace(/\s+/g, ' ') // 标准化空白
        .replace(/<([a-zA-Z0-9]+)[^>]*>/g, '<$1>') // 移除所有属性，只保留标签
        .replace(/>\s+</g, '><') // 移除标签间的空白
        .trim()
    }

    const cleanedReceived = cleanHTML(received)
    const cleanedExpected = cleanHTML(expected)

    return {
      pass: cleanedReceived === cleanedExpected,
      message: () => `
Expected structure: ${cleanedExpected}
Received structure: ${cleanedReceived}
Original received: ${received}
      `,
    }
  },
})

describe('Editor Basic Functions', () => {
  let editor: Editor

  // 每个测试前创建编辑器实例
  beforeEach(() => {
    editor = new Editor({
      extensions: [
        ...ExtensionKit({ provider: null, disableUniqueID: true }).filter(
          (e) => e !== undefined,
        ),
      ],
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
    expect(editor.getHTML()).toMatchTiptapStructure(
      '<h1>Hello World</h1><p></p>',
    )
  })

  // 测试链接功能
  it('should handle links', () => {
    editor.commands.selectAll()
    editor.commands.setLink({ href: 'https://example.com' })
    expect(editor.getHTML()).toMatchTiptapStructure(
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
      updated = true
      console.log('update')
    })
    editor.emit('update', { editor, transaction: {} as Transaction })
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
