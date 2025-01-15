import { useTranslation } from 'react-i18next'

import type { TFunction } from 'i18next'
import type { Group } from './types'

export const GROUPS = (t: TFunction<'translation', undefined>): Group[] => {
  return [
    {
      name: 'format',
      title: t('editor.format.title'),
      commands: [
        {
          name: 'heading1',
          label: t('editor.format.heading.h1.label'),
          iconName: 'Heading1',
          description: t('editor.format.heading.h1.description'),
          aliases: ['h1'],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 1 }).run()
          },
          isActive: (editor) => editor.isActive('heading', { level: 1 }),
          shortcut: ['Mod', '1'],
        },
        {
          name: 'heading2',
          label: t('editor.format.heading.h2.label'),
          iconName: 'Heading2',
          description: t('editor.format.heading.h2.description'),
          aliases: ['h2'],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 2 }).run()
          },
          isActive: (editor) => editor.isActive('heading', { level: 2 }),
          shortcut: ['Mod', '2'],
        },
        {
          name: 'heading3',
          label: t('editor.format.heading.h3.label'),
          iconName: 'Heading3',
          description: t('editor.format.heading.h3.description'),
          aliases: ['h3'],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 3 }).run()
          },
          isActive: (editor) => editor.isActive('heading', { level: 3 }),
          shortcut: ['Mod', '3'],
        },
        {
          name: 'bulletList',
          label: t('editor.format.list.bullet.label'),
          iconName: 'List',
          description: t('editor.format.list.bullet.description'),
          aliases: ['ul'],
          action: (editor) => {
            editor.chain().focus().toggleBulletList().run()
          },
          isActive: (editor) => editor.isActive('bulletList'),
          shortcut: ['Mod', 'Shift', ']'],
        },
        {
          name: 'numberedList',
          label: t('editor.format.list.numbered.label'),
          iconName: 'ListOrdered',
          description: t('editor.format.list.numbered.description'),
          aliases: ['ol'],
          action: (editor) => {
            editor.chain().focus().toggleOrderedList().run()
          },
          isActive: (editor) => editor.isActive('orderedList'),
          shortcut: ['Mod', 'Shift', '['],
        },
        {
          name: 'taskList',
          label: t('editor.format.list.task.label'),
          iconName: 'ListTodo',
          description: t('editor.format.list.task.description'),
          aliases: ['todo'],
          action: (editor) => {
            editor.chain().focus().toggleTaskList().run()
          },
          isActive: (editor) => editor.isActive('taskList'),
          shortcut: ['Mod', 'Shift', 'X'],
        },
        {
          name: 'toggleList',
          label: t('editor.format.list.toggle.label'),
          iconName: 'ListCollapse',
          description: t('editor.format.list.toggle.description'),
          aliases: ['toggle'],
          action: (editor) => {
            editor.chain().focus().setDetails().run()
          },
          isActive: (editor) => editor.isActive('details'),
          shortcut: ['Mod', 'l'],
        },
        {
          name: 'blockquote',
          label: t('editor.format.quote.label'),
          iconName: 'Quote',
          description: t('editor.format.quote.description'),
          action: (editor) => {
            editor.chain().focus().setBlockquote().run()
          },
          isActive: (editor) => editor.isActive('blockquote'),
          shortcut: ['Mod', 'Shift', 'Q'],
        },
        {
          name: 'codeBlock',
          label: t('editor.format.codeBlock.label'),
          iconName: 'SquareCode',
          description: t('editor.format.codeBlock.description'),
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            editor.chain().focus().setCodeBlock().run()
          },
          isActive: (editor) => editor.isActive('codeBlock'),
          shortcut: ['Mod', 'Shift', 'K'],
        },
        {
          name: 'bold',
          label: t('editor.format.text.bold.label'),
          iconName: 'Bold',
          description: t('editor.format.text.bold.description'),
          action: (editor) => {
            editor.chain().focus().toggleBold().run()
          },
          isActive: (editor) => editor.isActive('bold'),
          shortcut: ['Mod', 'B'],
        },
        {
          name: 'italic',
          label: t('editor.format.text.italic.label'),
          iconName: 'Italic',
          description: t('editor.format.text.italic.description'),
          action: (editor) => {
            editor.chain().focus().toggleItalic().run()
          },
          isActive: (editor) => editor.isActive('italic'),
          shortcut: ['Mod', 'I'],
        },
        {
          name: 'underline',
          label: t('editor.format.text.underline.label'),
          iconName: 'Underline',
          description: t('editor.format.text.underline.description'),
          action: (editor) => {
            editor.chain().focus().toggleUnderline().run()
          },
          isActive: (editor) => editor.isActive('underline'),
          shortcut: ['Mod', 'U'],
        },
        {
          name: 'code',
          label: t('editor.format.text.code.label'),
          iconName: 'Code',
          description: t('editor.format.text.code.description'),
          action: (editor) => {
            editor.chain().focus().toggleCode().run()
          },
          isActive: (editor) => editor.isActive('code'),
          shortcut: ['Mod', 'Shift', '`'],
        },
        {
          name: 'strike',
          label: t('editor.format.text.strike.label'),
          iconName: 'Strikethrough',
          description: t('editor.format.text.strike.description'),
          action: (editor) => {
            editor.chain().focus().toggleStrike().run()
          },
          isActive: (editor) => editor.isActive('strike'),
          shortcut: ['Mod', 'Shift', '5'],
        },
        {
          name: 'comment',
          label: 'Comment',
          iconName: 'MessageSquare',
          description: 'Add comment',
          action: (_editor) => {
            // editor.chain().focus().().run()
          },
          isActive: (editor) => editor.isActive('comment'),
          shortcut: ['Mod', 'Shift', 'M'],
        },
        {
          name: 'link',
          label: 'Link',
          iconName: 'Link',
          description: 'Insert link',
          action: (editor) => {
            editor
              .chain()
              .focus()
              .setLink({ href: 'https://example.com' })
              .run()
          },
          isActive: (editor) => editor.isActive('link'),
          shortcut: ['Mod', 'K'],
        },
        {
          name: 'clearFormat',
          label: 'Clear Format',
          iconName: 'RemoveFormatting',
          description: 'Clear all formatting',
          action: (editor) => {
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          },
          shortcut: ['Mod', '\\'],
        },
      ],
    },
    {
      name: 'insert',
      title: t('editor.insert.title'),
      commands: [
        {
          name: 'table',
          label: t('editor.insert.table.label'),
          iconName: 'Table',
          description: t('editor.insert.table.description'),
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
              .run()
          },
          isActive: (editor) => editor.isActive('table'),
          shortcut: ['Mod', 'T'],
        },
        {
          name: 'image',
          label: t('editor.insert.image.label'),
          iconName: 'Image',
          description: t('editor.insert.image.description'),
          aliases: ['img'],
          action: (editor) => {
            editor.chain().focus().setImageUpload().run()
          },
          isActive: (editor) => editor.isActive('image'),
          shortcut: ['Mod', 'Shift', 'I'],
        },
        {
          name: 'columns',
          label: t('editor.insert.columns.label'),
          iconName: 'Columns2',
          description: t('editor.insert.columns.description'),
          aliases: ['cols'],
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            editor
              .chain()
              .focus()
              .setColumns()
              .focus(editor.state.selection.head - 1)
              .run()
          },
          isActive: (editor) => editor.isActive('columns'),
          shortcut: ['Mod', 'Enter'],
        },
        {
          name: 'horizontalRule',
          label: t('editor.insert.horizontalRule.label'),
          iconName: 'Minus',
          description: t('editor.insert.horizontalRule.description'),
          aliases: ['hr'],
          action: (editor) => {
            editor.chain().focus().setHorizontalRule().run()
          },
          isActive: (editor) => editor.isActive('horizontalRule'),
        },
        {
          name: 'toc',
          label: t('editor.insert.toc.label'),
          iconName: 'Book',
          description: t('editor.insert.toc.description'),
          aliases: ['outline'],
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            editor.chain().focus().insertTableOfContents().run()
          },
          isActive: (editor) => editor.isActive('tableOfContents'),
        },
      ],
    },
  ]
}

export const useGroups = () => {
  const { t } = useTranslation()
  return GROUPS(t)
}

export default useGroups
