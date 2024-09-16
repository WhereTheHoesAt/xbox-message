import { Collection } from '@discordjs/collection'

import { XboxMessage } from '../..'

import { Group } from '../Group'

import { APIGroup } from '../../rest'

export class GroupManager {

  public client: XboxMessage

  public cache = new Collection<string, Group>()

  constructor(client: XboxMessage) {

    this.client = client

  }

  async fetch(id: string) {
    const existing = this.cache.get(id)

    if (existing) return existing

    const data = await this.client.rest.getGroup(id)

    return this.add(data.group, true)
  }

  add(data: APIGroup, cache = true, { id }: { id?: string } = {}) {

    const existing = this.cache.get(id ?? data.groupId)

    if (existing) {
      return existing
    }

    const entry = new Group(this.client, data)

    if (cache) this.cache.set(id ?? entry.id, entry)

    return entry
  }

}