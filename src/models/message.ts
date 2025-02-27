import { ChatMessage } from '@libeilong/chatgpt'
import { makeAutoObservable } from 'mobx'
import pangu from 'pangu'
import { openTextArea } from '../components/popups/textarea'
import { Storage } from '../shared/storage'
import { stores } from '../stores'

export type MessageState = 'sending' | 'fail' | 'done'

export class Message implements ChatMessage {
  id!: string
  text!: string
  createdAt!: number
  role!: 'user' | 'assistant'
  state: MessageState = 'sending'
  failedReason?: string
  parentMessageId?: string
  conversationId!: string

  get self() {
    return this.role === 'user'
  }

  get isWaiting() {
    return this.state === 'sending'
  }

  get renderText() {
    return stores.config.config.setting.textSpacing
      ? pangu.spacing(this.text)
      : this.text
  }

  constructor(
    opts: Pick<
      Message,
      | 'text'
      | 'createdAt'
      | 'role'
      | 'state'
      | 'conversationId'
      | 'parentMessageId'
      | 'failedReason'
    > & { id?: string }
  ) {
    if (opts.id && opts.state === 'sending') {
      opts.state = 'fail'
      opts.failedReason = '意外退出'
    }
    const id =
      opts.id || `${opts.conversationId}-${opts.createdAt}-${opts.role}`
    Object.assign(this, { ...opts, id })

    makeAutoObservable(this)
  }

  flushDb = () => {
    Storage.setMessage(this)
    return this
  }

  remove = () => {
    Storage.removeMessage(this.id)
  }

  onModifyText = async () => {
    const text = await openTextArea({
      title: '修改消息内容',
      defaultValue: this.text,
    })
    if (text) {
      this.text = text
      this.flushDb()
    }
  }

  toJSON = () => {
    return {
      id: this.id,
      text: this.text,
      createdAt: this.createdAt,
      role: this.role,
      state: this.state,
      parentMessageId: this.parentMessageId,
      conversationId: this.conversationId,
      failedReason: this.failedReason,
    }
  }
}

