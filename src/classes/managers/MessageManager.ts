import { Collection } from '@discordjs/collection'

import { ConversationType, XboxMessage } from '../..'

import { Message } from '../Message'
import { APIMessage } from '../../rest'

export class MessageManager {

  public client: XboxMessage

  public cache = new Collection<string, Message>()

  constructor(client: XboxMessage) {

    this.client = client

  }

  async fetch(id: string, conversationId: string, conversationType: ConversationType): Promise<Message | null> {
    const existing = this.cache.get(id)

    if (existing) return existing

    const data = await this.client.rest.getConversation(conversationType, conversationId)
      .then(data => data.messages.find(m => m.messageId === id))

    if (!data) return null

    return this.add(data, true)
  }

  add(data: APIMessage, cache = true, { id }: { id?: string } = {}) {
    const existing = this.cache.get(id ?? data.messageId)

    if (existing) {
      if (cache) {
        existing._patch(data)
        return existing
      }

      const clone = existing._clone()
      clone._patch(data)
      return clone
    }

    const entry = new Message(this.client, data)

    if (cache) this.cache.set(id ?? entry.id, entry)

    return entry
  }

}