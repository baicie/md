import { FolderOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Flex,
  Input,
  List,
  Popover,
  Typography,
  Layout,
  Dropdown,
} from 'antd'
import type { InputRef } from 'antd'
import { useTranslation } from 'react-i18next'
import Sort from '@/assets/sort.svg?react'
import { useKeyPress } from 'ahooks'
import { useRef } from 'react'
import { useFolders } from './use-folders'

const { Title, Text } = Typography
const { Sider } = Layout

const Folders = () => {
  const { t } = useTranslation()
  const { files, defaultMenuItems } = useFolders()
  const inputRef = useRef<InputRef>(null)
  const data = [
    {
      title: 'sdadasdasdasdasdas',
      description: 'sdadasdasdasdasdas_sdadasdasdasdasdas',
      type: 'folder',
    },
  ]
  useKeyPress(['ctrl.shift.f', 'meta.shift.f'], () => {
    inputRef.current?.focus()
  })

  return (
    <Sider width={260}>
      <Dropdown trigger={['contextMenu']} menu={{ items: defaultMenuItems }}>
        <Flex
          vertical
          style={{
            width: '260px',
            backgroundColor: '#fff',
            height: '100%',
          }}
        >
          <Flex style={{ margin: '24px 0 16px 20px' }} align="center">
            <Input
              ref={inputRef}
              prefix={<SearchOutlined />}
              placeholder={t('')}
              style={{ width: 170 }}
            ></Input>

            <Popover
              content={'content'}
              title="Title"
              trigger="click"
              placement="bottomRight"
              arrow={false}
            >
              <Button
                style={{ margin: '8px 20px 0 12px' }}
                icon={<Sort fontSize={20} />}
                type="text"
              ></Button>
            </Popover>
          </Flex>

          <List
            itemLayout="horizontal"
            dataSource={data}
            style={{
              margin: '0 12px',
            }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  style={{
                    cursor: 'pointer',
                  }}
                  avatar={<FolderOutlined />}
                  title={
                    <Title
                      level={4}
                      style={{ width: 146 }}
                      ellipsis={{ tooltip: item.title }}
                    >
                      {item.title}
                    </Title>
                  }
                  description={
                    <Text
                      style={{ width: 170 }}
                      ellipsis={{ tooltip: item.description }}
                    >
                      {item.description}
                    </Text>
                  }
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List>
        </Flex>
      </Dropdown>
    </Sider>
  )
}

export default Folders
