import { makeAutoObservable } from 'mobx'
import { MessageTemplateFeature } from '../shared/features'
import { matchFields } from '../shared/func/matchFields'
import { Storage } from '../shared/storage'

export enum MatchType {
  over = 'over',
  regex = 'regex',
}

export class Template {
  id?: string
  title: string
  template: string
  shortcut: boolean
  matchType?: MatchType
  match?: string

  constructor(
    opts: Pick<Template, 'id' | 'title' | 'template' | 'matchType' | 'match'> &
      Partial<Pick<Template, 'shortcut'>>
  ) {
    this.id = opts.id
    this.title = opts.title
    this.template = opts.template
    this.shortcut = opts.shortcut ?? false
    this.matchType = opts.matchType ?? MatchType.over
    this.match = opts.match
    makeAutoObservable(this)
  }

  checkShortcut() {
    if (this.shortcut) {
      const fields = matchFields(this.template)
      if (fields.length !== 1 || fields[0] !== '{内容}')
        throw Error(
          '模板内容不符合快捷指令要求：模板内容中有且只能有一个 "{内容}"'
        )
      if (this.matchType === MatchType.regex && !this.match) {
        throw Error('请输入匹配正则')
      }
    }
  }

  registerFeature() {
    MessageTemplateFeature.register(this)
  }

  unregisterFeature() {
    MessageTemplateFeature.unregister(this)
  }

  flushDb() {
    this.checkShortcut()
    if (this.shortcut) {
      this.registerFeature()
    } else {
      this.unregisterFeature()
    }
    Storage.setTemplate(this)
    return this
  }

  remove() {
    this.unregisterFeature()
    Storage.removeTemplate(this.id!)
  }

  toJSON = () => {
    return {
      id: this.id,
      title: this.title,
      template: this.template,
      shortcut: this.shortcut,
      matchType: this.matchType,
      match: this.match,
    }
  }
}

