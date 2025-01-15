export const zh = {
  editor: {
    format: {
      title: '格式',
      heading: {
        h1: {
          label: '标题 1',
          description: '一级标题',
        },
        h2: {
          label: '标题 2',
          description: '二级标题',
        },
        h3: {
          label: '标题 3',
          description: '三级标题',
        },
      },
      list: {
        bullet: {
          label: '无序列表',
          description: '创建无序列表',
        },
        numbered: {
          label: '有序列表',
          description: '创建有序列表',
        },
        task: {
          label: '任务列表',
          description: '创建待办事项列表',
        },
        toggle: {
          label: '折叠列表',
          description: '创建可折叠内容',
        },
      },
      text: {
        bold: {
          label: '加粗',
          description: '将文字加粗',
        },
        italic: {
          label: '斜体',
          description: '将文字变为斜体',
        },
        underline: {
          label: '下划线',
          description: '添加下划线',
        },
        code: {
          label: '行内代码',
          description: '插入行内代码',
        },
        strike: {
          label: '删除线',
          description: '添加删除线',
        },
      },
      quote: {
        label: '引用',
        description: '插入引用内容',
      },
      codeBlock: {
        label: '代码块',
        description: '插入代码块',
      },
    },
    insert: {
      title: '插入',
      table: {
        label: '表格',
        description: '插入表格',
      },
      image: {
        label: '图片',
        description: '插入图片',
      },
      columns: {
        label: '分栏',
        description: '添加两栏内容',
      },
      horizontalRule: {
        label: '分割线',
        description: '插入水平分割线',
      },
      toc: {
        label: '目录',
        description: '插入目录',
      },
    },
  },
} as const
