import { makeAutoObservable } from 'mobx'
import { ChatBalance } from '../types'

export class ConversationTemplate {
  id?: string
  name: string
  systemMessage: string
  balance: ChatBalance
  contextMessageCount?: number

  constructor(
    opts: Pick<
      ConversationTemplate,
      'id' | 'name' | 'systemMessage' | 'contextMessageCount'
    > &
      Partial<Pick<ConversationTemplate, 'balance'>>
  ) {
    this.id = opts.id
    this.name = opts.name
    this.systemMessage = opts.systemMessage
    this.balance = opts.balance ?? ChatBalance.balance
    this.contextMessageCount = opts.contextMessageCount

    makeAutoObservable(this)
  }

  toJSON = () => {
    return {
      id: this.id,
      name: this.name,
      systemMessage: this.systemMessage,
      balance: this.balance,
      contextMessageCount: this.contextMessageCount,
    }
  }
}

