import { Modal } from 'antd'
import { makeAutoObservable } from 'mobx'
import { platform } from '../../../shared/platform'
import { stores } from '../../../stores'
import { IConfig } from '../../../types'
import { homeStore } from '../../home/store'

export class Store {
  constructor() {
    makeAutoObservable(this)

    const convs = platform.db.get('c-').map((it) => it.key)
    const msgs = platform.db.get('m-').map((it) => it.key)
    this.storage = {
      convs,
      msgs,
    }
  }

  bindChange = (name: keyof IConfig['setting'], autoSave = true) => {
    return ({ target }: { target: any }) => {
      ;(stores.config.config.setting as any)[name] = target.value
      if (autoSave) stores.config.flushDb()
    }
  }

  storage: {
    convs: string[]
    msgs: string[]
  } = {
    convs: [],
    msgs: [],
  }

  clearStorage = async () => {
    const keys = [...this.storage.convs, ...this.storage.msgs]
    if (keys.length <= 0) return
    Modal.confirm({
      title: '提示',
      content: '这将清除所有的会话和消息，确定这么做吗？',
      onOk: () => {
        stores.chat.destory()
        homeStore.destory()
        for (const key of keys) {
          platform.db.removeItem(key)
        }
        this.storage.convs = []
        this.storage.msgs = []
      },
    })
  }

  checkUpdate = async () => {
    let needUpdate = await stores.app.checkUpdate(true)
    if (!needUpdate)
      Modal.success({ title: '提示', content: '当前已是最新版本' })
  }
}

