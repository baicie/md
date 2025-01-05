import type { FileItem } from '@/service/modules/files/types'
import type { MenuProps } from 'antd'
import { message } from 'antd'

// 抽离右键菜单逻辑
export const useContextMenu = () => {
  // 通用操作
  const handleCopy = (file?: FileItem) => {
    if (!file) return
    navigator.clipboard.writeText(file.path)
    message.success('复制路径成功')
  }

  const handleDelete = (file?: FileItem) => {
    if (!file) return
    // 删除逻辑
  }

  const handleRename = (file?: FileItem) => {
    if (!file) return
    // 重命名逻辑
  }

  // 根据文件类型获取对应的菜单项
  const getMenuItems = (file?: FileItem): MenuProps['items'] => {
    // 通用菜单项
    const commonItems = [
      {
        key: 'copy',
        label: '复制路径',
        onClick: () => handleCopy(file),
      },
      {
        key: 'rename',
        label: '重命名',
        onClick: () => handleRename(file),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
        onClick: () => handleDelete(file),
      },
    ]

    // 根据不同类型返回不同菜单
    switch (file?.type) {
      case 'folder':
        return [
          {
            key: 'newFile',
            label: '新建文件',
            onClick: () => {
              /* 新建文件逻辑 */
            },
          },
          {
            key: 'newFolder',
            label: '新建文件夹',
            onClick: () => {
              /* 新建文件夹逻辑 */
            },
          },
          { type: 'divider' as const },
          ...commonItems,
        ]

      case 'markdown':
        return [
          {
            key: 'edit',
            label: '编辑',
            onClick: () => {
              /* 编辑逻辑 */
            },
          },
          {
            key: 'preview',
            label: '预览',
            onClick: () => {
              /* 预览逻辑 */
            },
          },
          { type: 'divider' as const },
          ...commonItems,
        ]
      default:
        return commonItems
    }
  }

  return { getMenuItems }
}
