import { ConversationTemplate } from '../../models/conversationTemplate'

interface Props {
  it: ConversationTemplate
}

export function TemplateCardConversation({ it }: Props) {
  return <div>{it.name}</div>
}

