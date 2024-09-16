import { PartContentType, XboxMessage } from '../..'
import { GatewayVoiceContentPart } from '../../ws'

import { BasePart } from './BasePart'

export class VoicePart extends BasePart {

  public type: PartContentType.Voice

  public id: string

  public duration: number

  constructor(client: XboxMessage, data: GatewayVoiceContentPart) {

    super(client, data)

    this.type = data.contentType

    this.id = data.voiceAttachmentId

    this.duration = data.duration

  }

  async transcribe() {
    return this.client.rest.transcribeVoiceMessage(this.id)
  }

}