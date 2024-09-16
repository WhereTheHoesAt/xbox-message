import { XboxMessage, ConversationType } from '../..'

import { BaseConversation, BaseConversationData } from './BaseConversation'

export interface GroupConversationData extends BaseConversationData {
  type: ConversationType.Group
}

export class GroupConversation extends BaseConversation {

  constructor(client: XboxMessage, data: GroupConversationData) {
    super(client, data)
  }

  get group() {
    return this.client.groups.cache.find(g => g.conversationId === this.id)
  }


}