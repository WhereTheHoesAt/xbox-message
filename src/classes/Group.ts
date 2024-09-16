import { XboxMessage } from '..'

import { MessageEntity } from './MessageEntity'

import { APIGroup } from '../rest'

export class Group extends MessageEntity {

  public client: XboxMessage

  public id: string

  public name: string

  public ownerId: string

  public conversationId: string

  constructor(client: XboxMessage, data: APIGroup) {
    super(client)

    this.client = client

    this.id = data.groupId

    this.name = data.groupName

    this.ownerId = data.owner

    const conversation = data.channels[0]

    this.conversationId = conversation.id

  }

  get owner() {
    return this.client.users.cache.get(this.ownerId)
  }

  get conversation() {
    return this.client.conversations.cache.get(this.conversationId)
  }

}