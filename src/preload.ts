import proxy from 'https-proxy-agent'
import nodeFetch from 'node-fetch'

function proxyFetch(opts: {
  host?: string
  port?: string | number
  username?: string
  password?: string
}) {
  return ((url: any, options = {}) => {
    let auth: string | undefined = undefined
    if (opts.username && opts.password) {
      auth = `${opts.username}:${opts.password}`
    }

    const defaultOptions = {
      agent: proxy({
        auth,
        host: opts.host,
        port: opts.port,
      }),
    }

    return nodeFetch(url, {
      ...defaultOptions,
      ...options,
    })
  }) as any
}

window.preload = {
  proxyFetch,
}

