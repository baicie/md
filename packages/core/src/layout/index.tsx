import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Flex, Layout, Menu, MenuProps, theme } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

const { Header, Sider, Content } = Layout

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

  const [width, setWidth] = useState(300) // 初始宽度

  const handleResize = (e, { size }) => {
    setWidth(size.width)
  }

  return (
    <Layout>
      {/* change to npm install react-split-pane */}
      <ResizableBox
        width={width}
        height={0}
        onResize={handleResize}
        resizeHandles={['e']}
      >
        <Sider
          breakpoint="lg"
          collapsedWidth={75}
          trigger={null}
          collapsible
          collapsed={collapsed}
          onBreakpoint={(broken) => {
            setCollapsed(broken)
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'nav 1',
                onClick: () => navigate('/'),
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'nav 2',
                onClick: () => navigate('/demo'),
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: 'nav 3',
              },
            ]}
          />
        </Sider>
      </ResizableBox>
      <Layout>
        {/* <Sider>Sider2</Sider> */}
        <Content
          style={{
            overflow: 'hidden',
            height: '100vh',
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default DeftLayout
