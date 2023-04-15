/// <reference path="../../../node_modules/utools-api-types/index.d.ts" />

import { FeatureOption, IPlatform, OnEnter } from './interface'

export default new (class implements IPlatform {
  db = {
    getItem: (key: string) => {
      return utools.dbStorage.getItem(key)
    },
    setItem: (key: string, value: any) => {
      utools.dbStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
      utools.dbStorage.removeItem(key)
    },
    get: (key?: string) => {
      return utools.db.allDocs(key).map((it) => {
        return {
          key: it._id,
          value: it.value,
        }
      })
    },
    keys: () => {
      return utools.db.allDocs().map((it) => it._id)
    },
  }

  isDarkColors = () => {
    return utools.isDarkColors()
  }

  shellOpenExternal = (url: string) => {
    utools.shellOpenExternal(url)
  }

  removeFeature = (code: string) => {
    utools.removeFeature(code)
  }

  setFeature = (feature: FeatureOption) => {
    utools.setFeature({
      ...feature,
      platform: ['win32', 'darwin', 'linux'],
    })
  }

  onEnter: OnEnter = (callback) => {
    utools.onPluginEnter(callback)
  }
})()

