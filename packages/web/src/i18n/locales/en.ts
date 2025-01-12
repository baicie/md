export const en = {
  editor: {
    format: {
      title: 'Format',
      heading: {
        h1: {
          label: 'Heading 1',
          description: 'High priority section title',
        },
        h2: {
          label: 'Heading 2',
          description: 'Medium priority section title',
        },
        h3: {
          label: 'Heading 3',
          description: 'Low priority section title',
        },
      },
      list: {
        bullet: {
          label: 'Bullet List',
          description: 'Unordered list of items',
        },
        numbered: {
          label: 'Numbered List',
          description: 'Ordered list of items',
        },
        task: {
          label: 'Task List',
          description: 'Task list with todo items',
        },
        toggle: {
          label: 'Toggle List',
          description: 'Toggles can show and hide content',
        },
      },
      text: {
        bold: {
          label: 'Bold',
          description: 'Make text bold',
        },
        italic: {
          label: 'Italic',
          description: 'Make text italic',
        },
        underline: {
          label: 'Underline',
          description: 'Add underline to text',
        },
        code: {
          label: 'Code',
          description: 'Inline code',
        },
        strike: {
          label: 'Strike',
          description: 'Strike through text',
        },
      },
      quote: {
        label: 'Blockquote',
        description: 'Element for quoting',
      },
      codeBlock: {
        label: 'Code Block',
        description: 'Code block with syntax highlighting',
      },
    },
    insert: {
      title: 'Insert',
      table: {
        label: 'Table',
        description: 'Insert a table',
      },
      image: {
        label: 'Image',
        description: 'Insert an image',
      },
      columns: {
        label: 'Columns',
        description: 'Add two column content',
      },
      horizontalRule: {
        label: 'Horizontal Rule',
        description: 'Insert a horizontal divider',
      },
      toc: {
        label: 'Table of Contents',
        description: 'Insert a table of contents',
      },
    },
  },
} as const
