import { ConversationType, XboxMessage } from '..'

import { RestPostSendMessageResponse } from '../rest'

import { User } from './User'
import { MessagePayload, MessagePayloadOptions } from './MessagePayload'
import { XboxMessageError, XboxMessageErrorCodes } from './errors/XboxMessageError'

export class MessageEntity {

  client: XboxMessage

  constructor(client: XboxMessage) {
    this.client = client
  }

  async send(options: string | MessagePayload | MessagePayloadOptions) {

    const { GroupConversation } = await import('./Conversation/GroupConversation')
    const { OneToOneConversation } = await import('./Conversation/OneToOneConversation')

    let messagePayload

    if (options instanceof MessagePayload) {
      messagePayload = await options.resolveParts()
    }
    else {
      messagePayload = await MessagePayload.create(this.client, options).resolveParts()
    }

    if (!messagePayload.body) {
      throw new XboxMessageError(XboxMessageErrorCodes.MissingMessageParts)
    }

    let res: RestPostSendMessageResponse | null = null

    if (this instanceof GroupConversation) {
      if (!this.group) throw new XboxMessageError(XboxMessageErrorCodes.MessageGroupNotFound)

      res = await this.client.rest.sendMessageToGroup(this.group.id, '0', messagePayload.body)
    }
    else if (this instanceof OneToOneConversation || this instanceof User) {

      const id = this instanceof OneToOneConversation
        ? this.recipientId
        : this.id

      if (!id) throw new XboxMessageError(XboxMessageErrorCodes.MessageRecipientNotFound)

      res = await this.client.rest.sendMessageToPlayer(id, messagePayload.body)
    }

    if (!res?.messageId) {
      throw new XboxMessageError(XboxMessageErrorCodes.MessageNotFound)
    }

    const conversationType = this instanceof OneToOneConversation || this instanceof GroupConversation
      ? this.type
      : this instanceof User
        ? ConversationType.OneToOne
        : ConversationType.Group

    await this.client.rest.markMessageAsRead(res.messageId, res.conversationId, conversationType)

    const conversation = await this.client.conversations.fetch(res.conversationId, conversationType)

    if (!conversation) {
      throw new XboxMessageError(XboxMessageErrorCodes.ConversationNotFound)
    }

    const message = await conversation.messages.fetch(res.messageId, res.conversationId, conversationType)

    if (!message) {
      throw new XboxMessageError(XboxMessageErrorCodes.MessageNotFound)
    }

    return message
  }

}
