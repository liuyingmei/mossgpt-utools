import { Badge, Space, Tag } from 'antd'
import { Template } from '../../models/template'
import styles from './index.module.scss'
import { withObserver } from '../../shared/func/withObserver'
import clsx from 'clsx'
import { stores } from '../../stores'

interface Props {
  it: Template
}

export function TemplateCardMessage({ it }: Props) {
  return withObserver(() => (
    <div className={clsx(styles.index, stores.app.isDark && styles.dark)}>
      <div className={styles.header}>{it.title}</div>
      <div className={styles.main}>{it.template}</div>
      <div className={styles.footer}>
        {it.shortcut && <Badge color="#108ee9" text="快捷指令" />}
      </div>
    </div>
  ))
}

