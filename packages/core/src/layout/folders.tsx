import { FolderOutlined } from '@ant-design/icons'
import { List, Typography } from 'antd'

const { Title, Text } = Typography

const MdFolders = () => {
  const data = [
    {
      title: 'sdadasdasdasdasdas',
      description: 'sdadasdasdasdasdas_sdadasdasdasdasdas',
      type: 'folder',
    },
  ]
  return (
    <List
      style={{
        width: '200px',
        padding: '12px',
      }}
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
  )
}

export default MdFolders
