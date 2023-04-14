import { makeAutoObservable } from 'mobx'
import { ConversationTemplate } from '../../models/conversationTemplate'
import { Template } from '../../models/template'
import { Storage } from '../../shared/storage'
import { toTemplateForm } from '../templateForm/route'
import { SubPage } from './type'

export class Store {
  constructor() {
    this.templates = Storage.getTemplates()
    makeAutoObservable(this)
  }

  subPage = SubPage.messageTemplate

  keyword = ''

  _keyword = ''

  get renderTemplates() {
    return this.templates.filter((it) => {
      if (it instanceof Template) {
        return `${it.title} ${it.template}`.includes(this._keyword)
      } else {
        return `${it.name} ${it.systemMessage}`.includes(this._keyword)
      }
    })
  }

  timer?: NodeJS.Timeout

  setKeyword = (keyword: string) => {
    this.keyword = keyword
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this._keyword = keyword
    }, 300)
  }

  templates: (Template | ConversationTemplate)[] = []

  onCreate = () => {
    toTemplateForm()
  }

  onEdit = (it: Template | ConversationTemplate) => {
    toTemplateForm({
      query: { id: it.id! },
    })
  }

  onDel = (it: Template | ConversationTemplate) => {
    if (it instanceof Template) {
      it.remove()
      this.templates = this.templates.filter((t) => t.id !== it.id)
    } else {
      Storage.removeConversationTemplate(it.id!)
      this.templates = this.templates.filter((t) => t.id !== it.id)
    }
  }
}

