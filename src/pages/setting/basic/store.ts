import { objectPick } from '@libeilong/func'
import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { stores } from '../../../stores'
import { IConfig } from '../../../types'

let time: NodeJS.Timer

export class Store {
  constructor() {
    clearInterval(time)
    makeAutoObservable(this)

    this.fields = objectPick(stores.config.config, [
      'apiBaseUrl',
      'model',
      'max_tokens',
      'systemMessage',
    ])
    this.apiKey = stores.config.apiKey

    time = setInterval(() => {
      this.currentLink = this.currentLink === 1 ? 0 : 1
    }, 3000)
  }

  currentLink = 0

  fields: Pick<IConfig, 'apiBaseUrl' | 'model' | 'max_tokens' | 'systemMessage'>

  setModel = (model: string) => {
    this.fields.model = model
    if (model.includes('gpt-4')) {
      message.info(
        'GPT4 模型需要您的 OpenAI 账号具备相应使用权限，如无法使用请检查确认。'
      )
    }
  }

  apiKey: string

  onSubmit = () => {
    Object.assign(stores.config.config, this.fields)
    stores.config.apiKey = this.apiKey
    stores.config.flushDb()
    stores.chatgpt.reset()
    message.success('成功')
  }
}

