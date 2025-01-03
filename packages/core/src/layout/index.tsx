import { Layout, MenuProps, theme, Splitter } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import MdSider from './sider'
import MdFolders from './folders'

const { Content, Sider, Header } = Layout

const DeftLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()

  const items: MenuProps['items'] = [
    {
      key: 'en',
      label: 'English',
      onClick: () => i18n.changeLanguage('en'),
    },
    {
      key: 'cn',
      label: '中文',
      onClick: () => i18n.changeLanguage('cn'),
    },
    {
      key: 'fr',
      label: 'Français',
      onClick: () => i18n.changeLanguage('fr'),
    },
  ]

  return (
    <Layout>
      <MdSider></MdSider>
      <Layout
        style={{
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          backgroundColor: '#fff',
          overflow: 'hidden',
          boxShadow: '-2px 0 4px #00000005',
        }}
      >
        <Sider>
          <MdFolders></MdFolders>
        </Sider>

        <Layout>
          {/* TODO: 顶部导航栏 文件类型+菜单 */}
          <Header>Header TODO</Header>

          <Content
            style={{
              margin: '0',
              overflow: 'auto',
              height: 'calc(100vh - 64px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default DeftLayout
