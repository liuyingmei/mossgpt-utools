import { withStore } from '@libeilong/react-store-provider'
import { Page as _Page } from '.'
import { Options, navigate } from '../../router'
import { Store } from './store'

export type IQuery = {
  id: string
}

const Page = withStore(_Page, Store)

export const templateFormRoute = {
  path: '/templateForm',
  element: <Page />,
}

export function toTemplateForm(opts?: Options<IQuery>) {
  navigate('/templateForm', opts)
}

