import { XboxMessage } from '..'

import { MessageEntity } from './MessageEntity'

import { OneToOneConversation } from './Conversation/OneToOneConversation'

export type UserData = {
  id: string
  gamertag?: string
  displayImageURL?: string
  colour?: {
    primary: string
    secondary: string
    tertiary: string
  }
}

export class User extends MessageEntity {

  public client: XboxMessage

  public id: string

  public gamertag?: string

  public displayImageURL?: string

  public colour?: {
    primary: string
    secondary: string
    tertiary: string
  }

  constructor(client: XboxMessage, data: UserData) {
    super(client)

    this.client = client

    this.id = data.id

    this._patch(data)
  }

  get conversation() {
    return this.client.conversations.cache.find(g => g instanceof OneToOneConversation && g.recipientId === this.id)
  }

  async fetch(force = true) {
    return this.client.users.fetch(this.id, { force })
  }

  _clone(): User {
    return Object.assign(Object.create(this), this)
  }

  _patch(data: UserData) {

    if ('gamertag' in data) {
      this.gamertag = data.gamertag
    }

    if ('displayImageURL' in data) {
      this.displayImageURL = data.displayImageURL
    }

    if ('colour' in data) {
      this.colour = data.colour
    }

  }

}