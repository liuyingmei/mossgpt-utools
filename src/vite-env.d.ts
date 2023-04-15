/// <reference types="vite/client" />

declare const __INTRODUCTION__: string

declare interface Window {
  preload: {
    proxyFetch: (opts: {
      host?: string
      port?: string | number
      username?: string
      password?: string
    }) => any
  }
}

