import { Modal, message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { Template } from '../../models/template'
import { router } from '../../router'
import { Storage } from '../../shared/storage'
import { IQuery } from './route'

export class Store {
  constructor() {
    makeAutoObservable(this)
  }

  query?: IQuery

  onQueryChange = (query: IQuery) => {
    this.query = query
    if (this.query.id) {
      this.template = Storage.getTemplate(this.query.id)
    }
  }

  template = new Template({
    title: '',
    template: '',
    shortcut: false,
  })

  onSubmit = () => {
    try {
      if (!this.template.id) {
        this.template.id = Date.now() + ''
      }

      if (!this.template) throw Error('请输入模板内容')

      this.template.flushDb()
      message.success('保存成功')
      router.back()
    } catch (err: any) {
      message.error(err.message)
    }
  }

  onDel = async () => {
    if (!this.template.id) return
    Modal.confirm({
      title: '提示',
      content: '将删除当前模板，确定这么操作吗？',
      onOk: () => {
        Storage.removeTemplate(this.template.id!)
        message.success('删除成功')
        router.back()
      },
    })
  }
}

