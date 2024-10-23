import { Collection } from '@discordjs/collection'

import { Conversation, XboxMessage, XboxMessageError, XboxMessageErrorCodes } from '../..'

import { Message } from '../Message'
import { APIMessage } from '../../rest'

export class MessageManager {

  public client: XboxMessage

  public conversation: Conversation

  public cache = new Collection<string, Message>()

  constructor(conversation: Conversation) {

    this.client = conversation.client

    this.conversation = conversation

  }

  async fetch(id: string): Promise<Message>;
  async fetch(): Promise<Collection<string, Message>>;
  async fetch(id?: string) {
    if (id) return this.fetchSingle(id)
    return this.fetchMany()
  }

  private async fetchMany() {
    const data = await this.client.rest.getConversation(this.conversation.type, this.conversation.id)

    return data.messages.reduce((_data, message) => _data.set(message.messageId, this.add(message, true)), new Collection<string, Message>())
  }

  private async fetchSingle(id: string) {
    const existing = this.cache.get(id)

    if (existing) return existing

    const message = (await this.fetchMany()).get(id)

    if (!message) {
      throw new XboxMessageError(XboxMessageErrorCodes.MessageNotFound)
    }

    return message
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