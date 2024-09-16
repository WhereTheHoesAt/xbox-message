import { PartContentType, XboxMessage } from '../..'
import { GatewayContentParts } from '../../ws'

import { BasePart } from './BasePart'

export class UnknownPart extends BasePart {

  protected client: XboxMessage

  public type: PartContentType

  public version: number

  public data: unknown

  constructor(client: XboxMessage, data: GatewayContentParts) {

    super(client, data)

    this.client = client

    this.type = data.contentType

    this.version = data.version

    this.data = data

  }

}