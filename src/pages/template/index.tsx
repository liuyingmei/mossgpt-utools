import { MessageOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { useStore } from '@libeilong/react-store-provider'
import { Button, Input, Segmented, Space } from 'antd'
import { TemplateCardConversation } from '../../components/templateCardConversation'
import { TemplateCardMessage } from '../../components/templateCardMessage'
import { Template } from '../../models/template'
import { ContextMenu } from '../../shared/contextMenu'
import { withObserver } from '../../shared/func/withObserver'
import { toTemplateForm } from '../templateForm/route'
import styles from './index.module.scss'
import { Store } from './store'
import { SubPage } from './type'

export function Page() {
  const store = useStore<Store>()

  return withObserver(() => (
    <div className={styles.index}>
      <Space direction="vertical" size={22} style={{ width: '100%' }}>
        <div className={styles.header}>
          <h2>模板配置</h2>
          <Segmented
            disabled
            value={store.subPage}
            onChange={(value) => (store.subPage = value as any)}
            options={[
              {
                label: '角色',
                value: SubPage.conversationTemplate,
                icon: <TeamOutlined />,
              },
              {
                label: '消息',
                value: SubPage.messageTemplate,
                icon: <MessageOutlined />,
              },
            ]}
          />
        </div>
        <div className={styles.toolbar}>
          <Input
            className={styles.input}
            placeholder="搜索模板"
            value={store.keyword}
            onChange={({ target }) => store.setKeyword(target.value)}
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={store.onCreate}
          >
            创建模板
          </Button>
        </div>
        <div className={styles.box}>
          {store.renderTemplates.map((it, i) => {
            return (
              <div
                key={i}
                className={styles.item}
                onClick={() => {
                  if (it instanceof Template) {
                    toTemplateForm({
                      query: {
                        id: it.id!,
                      },
                    })
                  }
                }}
                onContextMenu={(event) => {
                  ContextMenu.open({
                    event,
                    items: [
                      {
                        label: '编辑模板',
                        onClick: () => store.onEdit(it),
                      },
                      {
                        label: '删除模板',
                        onClick: () => store.onDel(it),
                      },
                    ],
                  })
                }}
              >
                {it instanceof Template ? (
                  <TemplateCardMessage it={it} />
                ) : (
                  <TemplateCardConversation it={it} />
                )}
              </div>
            )
          })}
        </div>
      </Space>
    </div>
  ))
}

