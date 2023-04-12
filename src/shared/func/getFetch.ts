export function getFetch(proxy?: {
  open?: boolean
  host?: string
  port?: string | number
  username?: string
  password?: string
}) {
  if (proxy?.open && proxy?.host && proxy?.port) {
    return window.preload.proxyFetch(proxy)
  }
  return fetch
}

