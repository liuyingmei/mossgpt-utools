export function matchFields(text: string) {
  if (!text) return []
  const fields = text.match(/{(.*?)}/g)
  if (!fields) return []
  return fields.filter((field, index) => fields.indexOf(field) === index)
}

