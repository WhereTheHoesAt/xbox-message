import { PartContentType, XboxMessage } from '../..'
import { GatewayWeblinkContentPart } from '../../ws'

import { BasePart } from './BasePart'

export class WeblinkPart extends BasePart {

  public type: PartContentType.Weblink

  public text: string

  constructor(client: XboxMessage, data: GatewayWeblinkContentPart) {

    super(client, data)

    this.type = data.contentType

    this.text = data.text

  }

}