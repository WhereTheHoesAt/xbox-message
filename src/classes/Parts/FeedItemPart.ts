import { PartContentType, XboxMessage } from '../..'
import { GatewayFeedItemContentPart } from '../../ws'

import { BasePart } from './BasePart'

export class FeedItemPart extends BasePart {

  public type: PartContentType.FeedItem

  public locator: string

  constructor(client: XboxMessage, data: GatewayFeedItemContentPart) {

    super(client, data)

    this.type = data.contentType

    this.locator = data.locator

  }

}