import { Collection } from '@discordjs/collection'
import { XboxMessage } from '../..'

import { User, UserData } from '../User'
import { RestGetProfilePersonResponse } from '../../rest'

export class UserManager {

  public client: XboxMessage

  public cache = new Collection<string, User>()

  constructor(client: XboxMessage) {

    this.client = client

  }

  async fetch(id: string, { cache = true, force = false } = {}) {

    if (!force) {
      const existing = this.cache.get(id)
      if (existing) return existing
    }

    const data = await this.client.rest.getProfile(id)

    const mapped = {
      id: data.xuid,
      gamertag: data.gamertag,
      displayImageURL: data.displayPicRaw,
      colour: {
        primary: data.preferredColor.primaryColor,
        secondary: data.preferredColor.secondaryColor,
        tertiary: data.preferredColor.tertiaryColor,
      },
    }

    return this.add(mapped, cache)
  }

  async fetchMany(ids: string[], { cache = true } = {}) {
    const data = await this.client.rest.getProfiles(ids)

    const mapRes = (data: RestGetProfilePersonResponse) => ({
      id: data.xuid,
      gamertag: data.gamertag,
      displayImageURL: data.displayPicRaw,
      colour: {
        primary: data.preferredColor.primaryColor,
        secondary: data.preferredColor.secondaryColor,
        tertiary: data.preferredColor.tertiaryColor,
      },
    })

    return data.map(d => this.add(mapRes(d), cache))
  }

  add(data: UserData, cache = true, { id }: { id?: string } = {}) {
    const existing = this.cache.get(id ?? data.id)

    if (existing) {
      if (cache) {
        existing._patch(data)
        return existing
      }

      const clone = existing._clone()
      clone._patch(data)
      return clone
    }

    const entry = new User(this.client, data)

    if (cache) this.cache.set(id ?? entry.id, entry)

    return entry
  }

}