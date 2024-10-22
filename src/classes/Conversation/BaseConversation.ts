import { XboxMessage, ConversationType } from '../..'

import { APIMessage } from '../../rest'

import { MessageEntity } from '../MessageEntity'
import { MessageManager } from '../managers/MessageManager'

export interface BaseConversationData {
  conversationId: string
  type: ConversationType
  participants: string[] | null
  messages?: APIMessage[]
}

export class BaseConversation extends MessageEntity {

  public client: XboxMessage

  public messages: MessageManager

  public id: string

  public type: ConversationType

  public particpantIds: string[]

  constructor(client: XboxMessage, data: BaseConversationData) {
    super(client)

    this.client = client

    this.messages = new MessageManager(this)

    this.id = data.conversationId

    this.type = data.type

    this.particpantIds = data.participants ?? []

    if (data.messages) {
      data.messages.forEach(m => this.messages.add(m, true, { id: m.messageId }))
    }
  }

}
