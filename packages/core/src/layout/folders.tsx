import { FolderOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Flex, Input, List, Popover, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import Sort from '@/assets/sort.svg?react'

const { Title, Text } = Typography

const MdFolders = () => {
  const { t } = useTranslation()
  const data = [
    {
      title: 'sdadasdasdasdasdas',
      description: 'sdadasdasdasdasdas_sdadasdasdasdasdas',
      type: 'folder',
    },
  ]
  return (
    <Flex
      vertical
      style={{
        width: '260px',
        backgroundColor: '#fff',
        height: '100%',
      }}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder={t('')}
        size="small"
      ></Input>

      <Flex style={{ margin: '24px 0 16px 20px' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('')}
          size="small"
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
  )
}

export default MdFolders
