import { toHome } from '../../pages/home/route'
import { toTranslation } from '../../pages/translation/route'
import { handleFeature } from '../features'
import { platform } from '../platform'

export function registerHooks() {
  platform.onEnter(({ code, payload }) => {
    if (code === 'text') {
      toHome({ query: { text: payload } })
    } else if (code === 'translation') {
      toTranslation({ query: { text: payload } })
    } else if (code.startsWith('moss-')) {
      handleFeature({ code, payload })
    }
  })
}

