import { XboxMessage, ConversationType } from '../..'

import { BaseConversation, BaseConversationData } from './BaseConversation'

export interface OneToOneConversationData extends BaseConversationData {
  type: ConversationType.OneToOne
}

export class OneToOneConversation extends BaseConversation {

  public recipientId: string

  constructor(client: XboxMessage, data: OneToOneConversationData) {
    super(client, data)

    this.recipientId = this.particpantIds.filter(x => x !== this.client.user?.id)[0]

  }

  get recipient() {
    return this.client.users.cache.get(this.recipientId)
  }

}