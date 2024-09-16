import { PartContentType, XboxMessage } from '../..'
import { GatewayDirectMentionContentPart } from '../../ws'

import { BasePart } from './BasePart'

export class DirectMentionPart extends BasePart {

  public type: PartContentType.DirectMention

  public text: string

  public xuid: string

  constructor(client: XboxMessage, data: GatewayDirectMentionContentPart) {

    super(client, data)

    this.type = data.contentType

    this.text = data.text

    this.xuid = data.xuid

  }

}