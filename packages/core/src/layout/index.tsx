import { Flex, Layout, MenuProps, theme } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import MdSider from './sider'
import MdFolders from './folders'

const { Content } = Layout

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
      <Content
        style={{
          overflow: 'hidden',
          height: '100vh',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Flex gap="small">
          <MdFolders></MdFolders>

          <Outlet />
        </Flex>
      </Content>
    </Layout>
  )
}

export default DeftLayout
