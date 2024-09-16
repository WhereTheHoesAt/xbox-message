import { PartContentType, XboxMessage } from '../..'
import { GatewayTextContentPart } from '../../ws'

import { BasePart } from './BasePart'

export type APITextPart = {
  text: string,
  contentType: string,
  version: number
}

export class TextPart extends BasePart {

  public type: PartContentType.Text

  public text: string

  constructor(client: XboxMessage, data: GatewayTextContentPart) {

    super(client, data)

    this.type = data.contentType

    this.text = data.text

  }

}