import { commandPanelStore } from '../../components/popups/commandPanel/store'
import {
  DefaultConfig,
  DefaultConversationTemplates,
  DefaultMessageTemplates,
} from '../../constance'
import { Conversation } from '../../models/conversation'
import { ConversationTemplate } from '../../models/conversationTemplate'
import { Message } from '../../models/message'
import { Template } from '../../models/template'
import { IConfig, IgnoreType } from '../../types'
import { filterSameValue } from '../func/filterSameValue'
import { isNil } from '../func/isNil'
import { platform } from '../platform'

export class Storage {
  static getApiKey() {
    return this.getItem('apiKey')
  }

  static setApiKey(key: string) {
    return this.setItem('apiKey', key)
  }

  static setConversation(it: Conversation) {
    this.setItem(`c-${it.id}`, it.toJSON())
    commandPanelStore.setDoc({
      id: it.id,
      text: it.name,
      type: 'conversation',
    })
  }

  static getConversations() {
    const conversations = this.get(`c-`)
    return conversations.map(({ value }: any) => {
      return new Conversation(value)
    })
  }

  static removeConversation(id: string) {
    this.removeItem(`c-${id}`)
  }

  static getMessage(id: string) {
    return new Message(this.getItem(`m-${id}`))
  }

  static setMessage(it: Message) {
    this.setItem(`m-${it.id}`, it.toJSON())
    commandPanelStore.setDoc({
      id: it.id,
      text: it.text,
      type: 'message',
      conversationId: it.conversationId,
    })
  }

  static getMessagesByConversationId(id: string) {
    return this.get(`m-${id}`).map(({ value }) => new Message(value))
  }

  static removeMessagesByConversationId(id: string) {
    this.remove(`m-${id}`)
  }

  static removeMessage(id: string) {
    this.removeItem(`m-${id}`)
  }

  static getConfig(): IConfig {
    const config = this.getItem('config')
    const proxy = Object.assign({}, DefaultConfig.proxy, config?.proxy)
    const setting = Object.assign({}, DefaultConfig.setting, config?.setting)
    return Object.assign({}, DefaultConfig, config, { proxy, setting })
  }

  static setConfig(config: Partial<IConfig>) {
    config = filterSameValue(DefaultConfig, config)
    this.setItem('config', config)
  }

  static removeConfig() {
    this.removeItem('config')
  }

  static getTemplates() {
    let templates = this.get('t-').map((it) => it.value)
    if (templates.length === 0) {
      templates = DefaultMessageTemplates.map((it, i) => {
        return new Template({
          id: Date.now() + '' + i,
          ...it,
        }).flushDb()
      })
      return templates
    }

    return templates.map((it) => new Template(it))
  }

  static getTemplate(id: string) {
    const it = this.getItem(`t-${id}`)
    return new Template(it)
  }

  static setTemplate(it: Template) {
    this.setItem(`t-${it.id}`, it.toJSON())
  }

  static removeTemplate(id: string) {
    this.removeItem(`t-${id}`)
  }

  static getConversationTemplates() {
    let its = this.get('ct-').map((it) => it.value)
    if (its.length === 0) {
      its = DefaultConversationTemplates.map((it, i) => ({
        id: Date.now() + '' + i,
        ...it,
      }))
      for (const it of its) {
        this.setConversationTemplate(new ConversationTemplate(it))
      }
    }

    return its.map((it) => new Template(it))
  }

  static getConversationTemplate(id: string) {
    const it = this.getItem(`ct-${id}`)
    return new Template(it)
  }

  static setConversationTemplate(it: ConversationTemplate) {
    this.setItem(`ct-${it.id}`, it.toJSON())
  }

  static removeConversationTemplate(id: string) {
    this.removeItem(`ct-${id}`)
  }

  static getLastDataVersion() {
    const lastDataVersion = this.getItem('dataVersion')
    if (lastDataVersion === null || lastDataVersion === undefined) {
      return -1
    }
    return lastDataVersion
  }

  static setLastDataVersion(version: number) {
    this.setItem('dataVersion', version)
  }

  static setTheme(theme: string) {
    this.setItem('theme', theme)
  }

  static getTheme() {
    const theme = this.getItem('theme')
    if (theme) return theme
    else return platform.isDarkColors() ? 'dark' : 'light'
  }

  static removeTheme() {
    this.removeItem('theme')
  }

  static setIgnore(type: IgnoreType, value: string) {
    this.setItem(`${type}-ignore-${value}`, true)
  }

  static getIgnore(type: IgnoreType, value: string): boolean {
    const ignore = this.getItem(`${type}-ignore-${value}`)
    return isNil(ignore) ? false : true
  }

  static setItem(key: string, value: any) {
    platform.db.setItem(key, value)
  }

  static removeItem(key: string) {
    platform.db.removeItem(key)
  }

  static getItem(key: string) {
    return platform.db.getItem(key)
  }

  static get(key?: string) {
    return platform.db.get(key)
  }

  static remove(key?: string) {
    const docs = this.get(key)
    for (const doc of docs) {
      platform.db.removeItem(doc.key)
    }
  }
}

