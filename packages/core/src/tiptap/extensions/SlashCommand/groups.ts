import { Group } from './types'
import i18n from '@/locales'
export const useSlashCommandGroups = (): Group[] => {
  const { t } = i18n

  return [
    {
      name: 'format',
      title: t('tiptap.slashCommands.groups.format'),
      commands: [
        {
          name: 'heading1',
          label: t('tiptap.slashCommands.commands.heading1.label'),
          iconName: 'Heading1',
          description: t('tiptap.slashCommands.commands.heading1.description'),
          aliases: ['h1'],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 1 }).run()
          },
        },
        {
          name: 'heading2',
          label: t('tiptap.slashCommands.commands.heading2.label'),
          iconName: 'Heading2',
          description: t('tiptap.slashCommands.commands.heading2.description'),
          aliases: ['h2'],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 2 }).run()
          },
        },
        {
          name: 'heading3',
          label: t('tiptap.slashCommands.commands.heading3.label'),
          iconName: 'Heading3',
          description: t('tiptap.slashCommands.commands.heading3.description'),
          aliases: ['h3'],
          action: (editor) => {
            editor.chain().focus().setHeading({ level: 3 }).run()
          },
        },
        {
          name: 'bulletList',
          label: t('tiptap.slashCommands.commands.bulletList.label'),
          iconName: 'List',
          description: t(
            'tiptap.slashCommands.commands.bulletList.description',
          ),
          aliases: ['ul'],
          action: (editor) => {
            editor.chain().focus().toggleBulletList().run()
          },
        },
        {
          name: 'numberedList',
          label: t('tiptap.slashCommands.commands.numberedList.label'),
          iconName: 'ListOrdered',
          description: t(
            'tiptap.slashCommands.commands.numberedList.description',
          ),
          aliases: ['ol'],
          action: (editor) => {
            editor.chain().focus().toggleOrderedList().run()
          },
        },
        {
          name: 'taskList',
          label: t('tiptap.slashCommands.commands.taskList.label'),
          iconName: 'ListTodo',
          description: t('tiptap.slashCommands.commands.taskList.description'),
          aliases: ['todo'],
          action: (editor) => {
            editor.chain().focus().toggleTaskList().run()
          },
        },
        {
          name: 'toggleList',
          label: t('tiptap.slashCommands.commands.toggleList.label'),
          iconName: 'ListCollapse',
          description: t(
            'tiptap.slashCommands.commands.toggleList.description',
          ),
          aliases: ['toggle'],
          action: (editor) => {
            ;(editor.chain().focus() as any).setDetails().run()
          },
        },
        {
          name: 'blockquote',
          label: t('tiptap.slashCommands.commands.blockquote.label'),
          iconName: 'Quote',
          description: t(
            'tiptap.slashCommands.commands.blockquote.description',
          ),
          action: (editor) => {
            editor.chain().focus().setBlockquote().run()
          },
        },
        {
          name: 'codeBlock',
          label: t('tiptap.slashCommands.commands.codeBlock.label'),
          iconName: 'SquareCode',
          description: t('tiptap.slashCommands.commands.codeBlock.description'),
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            editor.chain().focus().setCodeBlock().run()
          },
        },
      ],
    },
    {
      name: 'insert',
      title: t('tiptap.slashCommands.groups.insert'),
      commands: [
        {
          name: 'table',
          label: t('tiptap.slashCommands.commands.table.label'),
          iconName: 'Table',
          description: t('tiptap.slashCommands.commands.table.description'),
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
              .run()
          },
        },
        {
          name: 'image',
          label: t('tiptap.slashCommands.commands.image.label'),
          iconName: 'Image',
          description: t('tiptap.slashCommands.commands.image.description'),
          aliases: ['img'],
          action: (editor) => {
            editor.chain().focus().setImageUpload().run()
          },
        },
        {
          name: 'columns',
          label: t('tiptap.slashCommands.commands.columns.label'),
          iconName: 'Columns2',
          description: t('tiptap.slashCommands.commands.columns.description'),
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
        },
        {
          name: 'horizontalRule',
          label: t('tiptap.slashCommands.commands.horizontalRule.label'),
          iconName: 'Minus',
          description: t(
            'tiptap.slashCommands.commands.horizontalRule.description',
          ),
          aliases: ['hr'],
          action: (editor) => {
            editor.chain().focus().setHorizontalRule().run()
          },
        },
        {
          name: 'toc',
          label: t('tiptap.slashCommands.commands.toc.label'),
          iconName: 'Book',
          aliases: ['outline'],
          description: t('tiptap.slashCommands.commands.toc.description'),
          shouldBeHidden: (editor) => editor.isActive('columns'),
          action: (editor) => {
            ;(editor.chain().focus() as any).insertTableOfContents().run()
          },
        },
      ],
    },
  ]
}

export default useSlashCommandGroups
