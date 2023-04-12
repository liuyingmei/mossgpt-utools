export function getFetch(proxy?: {
  host?: string
  port?: string | number
  username?: string
  password?: string
}) {
  if (proxy?.host && proxy?.port) {
    return window.preload.proxyFetch(proxy)
  }
  return fetch
}

