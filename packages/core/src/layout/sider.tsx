import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import {
  Flex,
  Layout,
  Menu,
  Button,
  Radio,
  RadioChangeEvent,
  FloatButton,
} from 'antd'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

type SiderType = 'default' | 'collapsed' | 'hidden'

const MdSider = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [hidden, setHidden] = useState(false)

  const updateSiderState = (hidden: boolean, collapsed: boolean) => {
    setHidden(hidden)
    setCollapsed(collapsed)
  }

  const onRadioChange = useCallback((value: SiderType) => {
    switch (value) {
      case 'default':
        updateSiderState(false, false)
        break
      case 'collapsed':
        updateSiderState(false, true)
        break
      case 'hidden':
        updateSiderState(true, false)
        break
      default:
        break
    }
  }, [])
  return hidden ? (
    <FloatButton onClick={() => onRadioChange('default')}></FloatButton>
  ) : (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Flex vertical>
        <Menu
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

        <Radio.Group onChange={(e) => onRadioChange(e.target.value)}>
          <Radio.Button value="default">
            <AppstoreOutlined />
          </Radio.Button>

          <Radio.Button value="collapsed">
            <AppstoreOutlined />
          </Radio.Button>

          <Radio.Button value="hidden">
            <AppstoreOutlined />
          </Radio.Button>
        </Radio.Group>
      </Flex>
    </Sider>
  )
}

export default MdSider
