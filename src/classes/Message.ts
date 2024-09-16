import { PartContentType, XboxMessage } from '..'

import { TextPart } from './Parts/TextPart'
import { VoicePart } from './Parts/VoicePart'
import { ImagePart } from './Parts/ImagePart'
import { UnknownPart } from './Parts/UnknownPart'
import { WeblinkPart } from './Parts/WeblinkPart'
import { FeedItemPart } from './Parts/FeedItemPart'
import { DirectMentionPart } from './Parts/DirectMention'
import { WeblinkMediaPart } from './Parts/WeblinkMediaPart'

import { User } from './User'
import { APIMessage } from '../rest'
import { GatewayXboxMessageContentMessage } from '../ws'

type Part = TextPart | VoicePart | ImagePart | WeblinkPart | WeblinkMediaPart | FeedItemPart | DirectMentionPart | UnknownPart

/**
 * Represents a message in the XboxMessage system.
 */
export class Message {

  /**
   * The XboxMessage client.
   */
  public client: XboxMessage

  /**
   * The unique identifier for the message.
   */
  public id: string

  /**
   * The timestamp when the message was created.
   */
  public timestampCreated?: string

  /**
   * The updated timestamp of the message.
   */
  public timestampUpdated?: string

  /**
   * Indicates whether the message is deleted or not.
   */
  public isDeleted?: boolean

  /**
   * An array of Part objects representing the different parts of a message.
   */
  public parts?: Part[]

  /**
     * The content of the message.
     * It may be empty if no text parts was in the message
     *
     * @remarks
     * The `content` property represents the main text content of the message.
     * It can be a single string or multiple strings concatenated together.
     * If the message has no content, this property will be an empty string.
     */
  public content?: string

  /**
   * The array of feed items in the message.
   *
   */
  public feedItems?: FeedItemPart[]

  /**
   * Represents an attachment within a message, a message can only contain a single attachment with no other parts.
   */
  public attachment?: ImagePart

  /**
   * Represents the voice part of a message.
   */
  public voice?: VoicePart

  /**
   * The conversation ID of the message.
   */
  public conversationId: string

  /**
   * The author ID of the message.
   */
  public userId: string

  /**
   * The author of the message.
   */
  public user: User

  constructor(client: XboxMessage, data: APIMessage) {

    this.client = client

    this.id = data.messageId

    this.conversationId = data.conversationId

    this.userId = data.sender

    this.user = this.client.users.add({ id: this.userId }, true)

    this._patch(data)

  }

  get conversation() {
    return this.client.conversations.cache.get(this.conversationId)
  }

  _clone(): Message {
    return Object.assign(Object.create(this), this)
  }

  _patch(data: APIMessage) {

    if ('timestamp' in data) {
      this.timestampCreated = data.timestamp
    }

    if ('lastUpdateTimestamp' in data) {
      this.timestampUpdated = data.lastUpdateTimestamp
    }

    if ('isDeleted' in data) {
      this.isDeleted = data.isDeleted
    }

    if ('contentPayload' in data) {
      this.parts = data.contentPayload.content.parts.map(part => {
        switch (part.contentType) {
          case PartContentType.Text:
            return new TextPart(this.client, part)
          case PartContentType.Voice:
            return new VoicePart(this.client, part)
          case PartContentType.Image:
            return new ImagePart(this.client, part)
          case PartContentType.Weblink:
            return new WeblinkPart(this.client, part)
          case PartContentType.WeblinkMedia:
            return new WeblinkMediaPart(this.client, part)
          case PartContentType.FeedItem:
            return new FeedItemPart(this.client, part)
          case PartContentType.DirectMention:
            return new DirectMentionPart(this.client, part)
          default:
            return new UnknownPart(this.client, part)
        }
      })

      this.content = this.parts
        .filter(part => part.isText() || part.isWeblink() || part.isWeblinkMedia() || part.isDirectMention())
        .map(part => part.isText() ? part.text : part.isWeblink() ? part.text : part.isWeblinkMedia() ? part.url : part.isDirectMention() ? part.text : '')
        .join('')

      this.feedItems = this.parts
        .filter((part: Part): part is FeedItemPart => part.isFeedItem())

      this.voice = this.parts
        .filter((part: Part): part is VoicePart => part.isVoice())
        .shift()

      this.attachment = this.parts
        .filter((part: Part): part is ImagePart => part.isImage())
        .shift()
    }

  }

  static fromWebsocket(client: XboxMessage, data: GatewayXboxMessageContentMessage) {
    return new Message(client, data.payload)
  }

}