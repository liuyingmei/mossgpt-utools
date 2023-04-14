import { withStore } from '@libeilong/react-store-provider'
import { Page as _Page } from '.'
import { navigate } from '../../router'
import { Store } from './store'

const Page = withStore(_Page, Store)

export const templateRoute = {
  path: '/template',
  element: <Page />,
}

export function toTemplate() {
  navigate('/template')
}

