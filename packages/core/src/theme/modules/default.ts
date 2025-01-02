import type { ThemeConfig } from 'antd'

export const defaultTheme: ThemeConfig = {
  token: {
    // 主色调
    colorPrimary: '#4E89FF', // 蓝色主色调(新建按钮的颜色)
    colorBgContainer: '#FFFFFF', // 主容器背景色

    // 侧边栏
    colorBgLayout: '#F7F7F7', // 左侧导航背景色

    // 菜单相关
    colorBgElevated: '#FFFFFF', // 下拉菜单背景色
    colorBgTextHover: '#F2F2F2', // 菜单项hover背景色
    colorBgTextActive: '#EAF1FF', // 菜单项选中背景色

    // 文字颜色
    colorText: '#1F1F1F', // 主要文字颜色
    colorTextSecondary: '#666666', // 次要文字颜色
    colorTextTertiary: '#999999', // 第三级文字颜色

    // 边框和分割线
    colorBorder: '#E8E8E8', // 边框颜色
    colorSplit: '#F0F0F0', // 分割线颜色

    // 其他
    borderRadius: 4, // 圆角大小
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', // 阴影效果
  },
  components: {
    Menu: {
      itemBg: '#F7F7F7', // 菜单项背景
      itemSelectedBg: '#EAF1FF', // 选中项背景
      itemHoverBg: '#F2F2F2', // hover背景
    },
    Layout: {
      siderBg: '#F7F7F7', // 侧边栏背景
      headerBg: '#FFFFFF', // 顶部背景
    },
  },
}
