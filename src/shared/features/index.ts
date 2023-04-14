import { parseCode } from './code'
import { MessageTemplateFeature } from './messageTemplate'
export { MessageTemplateFeature }

export function handleFeature({
  code,
  payload,
}: {
  code: string
  payload: any
}) {
  const { type, id } = parseCode(code)
  if (type === MessageTemplateFeature.type) {
    MessageTemplateFeature.handle({ id, payload })
  }
}

