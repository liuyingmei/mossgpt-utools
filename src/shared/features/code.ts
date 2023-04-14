import { FeatureType } from './type'

export function generateCode(type: FeatureType, id: string) {
  return `moss-${type}-${id}`
}

export function parseCode(code: string) {
  const [_, type, id] = code.split('-')
  return {
    type,
    id,
  } as {
    type: FeatureType
    id: string
  }
}

