import { Collection } from '@discordjs/collection'

import { ConversationType, XboxMessage } from '../..'

import { BaseConversation } from '../Conversation/BaseConversation'
import { GroupConversation, GroupConversationData } from '../Conversation/GroupConversation'
import { OneToOneConversation, OneToOneConversationData } from '../Conversation/OneToOneConversation'

import { XboxMessageError, XboxMessageErrorCodes } from '../errors/XboxMessageError'

export type Conversation = BaseConversation | OneToOneConversation | GroupConversation

export class ConversationManager {

  public client: XboxMessage

  public cache = new Collection<string, Conversation>()

  constructor(client: XboxMessage) {

    this.client = client

  }

  async fetch(id: string, type: ConversationType): Promise<Conversation | null> {
    const existing = this.cache.get(id)

    if (existing) return existing

    const data = await this.client.rest.getConversation(type, id)

    if (!data) return null

    return this.add(data, true)
  }

  add(data: OneToOneConversationData | GroupConversationData, cache = true, { id }: { id?: string } = {}) {

    const existing = this.cache.get(id ?? data.conversationId)

    if (existing) {
      return existing
    }

    let entry

    if (data.type === ConversationType.OneToOne) {
      entry = new OneToOneConversation(this.client, data)
    }
    else if (data.type === ConversationType.Group) {
      entry = new GroupConversation(this.client, data)
    }

    if (!entry) throw new XboxMessageError(XboxMessageErrorCodes.InvalidConversationType, data.type)

    if (cache) this.cache.set(id ?? entry.id, entry)

    return entry
  }

}