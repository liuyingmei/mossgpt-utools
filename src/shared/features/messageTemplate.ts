import { Template } from '../../models/template'
import { toHome } from '../../pages/home/route'
import { platform } from '../platform'
import { Storage } from '../storage'
import { generateCode } from './code'
import { FeatureType } from './type'

export class MessageTemplateFeature {
  static type = FeatureType.messageTemplate

  static unregister(template: Template) {
    platform.removeFeature(generateCode(this.type, template.id!))
  }

  static register(template: Template) {
    platform.setFeature({
      code: generateCode(this.type, template.id!),
      explain: template.title,
      cmds: [
        {
          type: template.matchType,
          label: template.title,
          match: template.match,
        } as any,
      ],
    })
  }

  static handle({ id, payload }: { id: string; payload: string }) {
    const template = Storage.getTemplate(id)
    toHome({
      query: {
        text: template.template.replace('{内容}', payload),
      },
    })
  }
}

