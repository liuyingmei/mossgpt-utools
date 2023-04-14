import { makeAutoObservable } from 'mobx'
import { stores } from '../../stores'

const languages = {
  zh: {
    name: '中文',
    value: 'zh',
  },
  en: {
    name: '英语',
    value: 'en',
  },
}

export const translationStore = new (class {
  constructor() {
    makeAutoObservable(this, {
      abortController: false,
    })
  }

  get config() {
    if (/[\u4e00-\u9fa5]/.test(this.source)) {
      return {
        targetLang: languages.en,
        sourceLang: languages.zh,
      }
    } else {
      return {
        targetLang: languages.zh,
        sourceLang: languages.en,
      }
    }
  }

  source = ''
  target = ''

  err?: Error

  timer?: NodeJS.Timeout

  onSourceChange = (text: string) => {
    this.abortController?.abort()
    this.source = text
    clearTimeout(this.timer)
    if (stores.config.config.setting.autoTranslation)
      this.timer = setTimeout(this.start, 1000)
  }

  abortController?: AbortController

  start = async () => {
    await stores.config.checkApiKey()
    if (this.source.trim() === '') return
    this.err = undefined
    this.abortController = new AbortController()
    try {
      const { targetLang, sourceLang } = this.config
      await stores.chatgpt.sendMessage(
        `${sourceLang.value}-${targetLang.value} translation of "${this.source}"`,
        {
          abortSignal: this.abortController.signal,
          onProgress: ({ text }) => {
            this.target = text
          },
        }
      )
    } catch (err: any) {
      if (err.name === 'AbortError') return
      this.err = err
    } finally {
      this.abortController = undefined
    }
  }

  reverse = () => {
    if (this.target.trim() === '') return
    this.onSourceChange(this.target)
    this.target = ''
  }

  get autoMode() {
    return stores.config.config.setting.autoTranslation
  }

  setAutoMode = (value: boolean) => {
    stores.config.config.setting.autoTranslation = value
    stores.config.flushDb()
  }
})()

