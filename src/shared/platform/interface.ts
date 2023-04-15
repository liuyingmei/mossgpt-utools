export interface FeatureOption {
  code: string
  explain: string
  cmds: {
    type: 'regex' | 'over'
    label: string
    match: string
  }[]
}

export type OnEnter = (
  callback: (action: { code: string; type: string; payload: any }) => void
) => void

export interface IPlatform {
  db: {
    getItem: (key: string) => any
    setItem: (key: string, value: any) => void
    removeItem: (key: string) => void
    get: (key?: string) => { key: string; value: any }[]
    keys: () => string[]
  }

  isDarkColors: () => boolean

  shellOpenExternal: (url: string) => void

  removeFeature: (code: string) => void
  setFeature: (feature: FeatureOption) => void

  onEnter: OnEnter
}

