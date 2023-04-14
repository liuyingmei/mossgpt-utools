import { ArrowLeftOutlined } from '@ant-design/icons'
import { useStore } from '@libeilong/react-store-provider'
import { Button, Checkbox, Input, Select, Space, Switch, Tooltip } from 'antd'
import { useEffect } from 'react'
import { MatchType } from '../../models/template'
import { router } from '../../router'
import { withObserver } from '../../shared/func/withObserver'
import { useQuery } from '../../shared/hooks/useQuery'
import styles from './index.module.scss'
import { IQuery } from './route'
import { Store } from './store'

export function Page() {
  const store = useStore<Store>()
  const query = useQuery<IQuery>()
  useEffect(() => {
    store.onQueryChange(query)
  }, [query, store])

  return withObserver(() => (
    <div className={styles.index}>
      <h2 className={styles.title} onClick={() => router.back()}>
        <ArrowLeftOutlined /> 返回
      </h2>
      <Space direction="vertical" size={12}>
        <Input
          placeholder="请输入模板标题"
          value={store.template.title}
          onChange={({ target }) => (store.template.title = target.value)}
        />
        <Input.TextArea
          placeholder="请输入模板内容（快捷入口需要包含：{内容}）"
          autoSize={{ minRows: 10 }}
          value={store.template.template}
          onChange={({ target }) => (store.template.template = target.value)}
        />
        <Tooltip title="设为快捷指令将可以通过超级面板或从输入框快速打开（仅当模板内容中有且只有一个 “{内容}” 才可使用）">
          <Checkbox
            checked={store.template.shortcut}
            onChange={(e) => (store.template.shortcut = e.target.checked)}
          >
            设为快捷指令
          </Checkbox>
        </Tooltip>
        {store.template.shortcut && (
          <Space.Compact style={{ width: '100%' }}>
            <Select
              placeholder="匹配类型"
              value={store.template.matchType}
              onChange={(value) => (store.template.matchType = value)}
              disabled={!store.template.shortcut}
            >
              <Select.Option value={MatchType.over}>任意文本</Select.Option>
              <Select.Option value={MatchType.regex}>正则匹配</Select.Option>
            </Select>
            <Input
              placeholder="请输入匹配正则（任意文本不需要配置此项）"
              value={store.template.match}
              onChange={({ target }) => (store.template.match = target.value)}
              disabled={store.template.matchType !== MatchType.regex}
            />
          </Space.Compact>
        )}
        <div className={styles.actions}>
          <Space>
            <Button type="primary" onClick={store.onSubmit}>
              保存配置
            </Button>
            {store.template.id && (
              <Button type="link" danger onClick={store.onDel}>
                删除
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </div>
  ))
}

