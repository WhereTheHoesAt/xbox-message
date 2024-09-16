import { PartContentType, XboxMessage } from '../..'

import { GatewayContentParts } from '../../ws'

import { ImagePart } from './ImagePart'
import { TextPart } from './TextPart'
import { VoicePart } from './VoicePart'
import { UnknownPart } from './UnknownPart'
import { WeblinkPart } from './WeblinkPart'
import { FeedItemPart } from './FeedItemPart'
import { WeblinkMediaPart } from './WeblinkMediaPart'
import { DirectMentionPart } from './DirectMention'

export class BasePart {

  protected client: XboxMessage

  public type: PartContentType

  public version: number

  constructor(client: XboxMessage, data: GatewayContentParts) {

    this.client = client

    this.type = data.contentType

    this.version = data.version

  }

  isText(): this is TextPart {
    return this.type === PartContentType.Text
  }

  isVoice(): this is VoicePart {
    return this.type === PartContentType.Voice
  }

  isImage(): this is ImagePart {
    return this.type === PartContentType.Image
  }

  isWeblink(): this is WeblinkPart {
    return this.type === PartContentType.Weblink
  }

  isWeblinkMedia(): this is WeblinkMediaPart {
    return this.type === PartContentType.WeblinkMedia
  }

  isFeedItem(): this is FeedItemPart {
    return this.type === PartContentType.FeedItem
  }

  isDirectMention(): this is DirectMentionPart {
    return this.type === PartContentType.DirectMention
  }

  isUnknown(): this is UnknownPart {
    return this.type in PartContentType
  }

}