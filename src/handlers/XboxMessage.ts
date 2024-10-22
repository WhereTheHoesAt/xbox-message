import { PayloadType, XboxMessage } from '..'

import { Message } from '../classes/Message'

import { GatewayXboxMessageResponse, GatewayXboxMessageContentMessage, GatewayXboxMessageJoinChatChannel } from '../ws'

export default async (client: XboxMessage, event: GatewayXboxMessageResponse) => {

  if (event.payload.type === PayloadType.ContentMessage) {

    const message = Message.fromWebsocket(client, event as GatewayXboxMessageContentMessage)

    if (message.isDeleted) {
      client.emit('messageDelete', message)
      return
    }

    if (!message.conversation) {
      await client.conversations.fetch(event.payload.conversationId, event.payload.conversationType)
    }

    message.conversation?.messages.cache.set(message.id, message)

    client.emit('message', message)

  }
  else if (event.payload.type === PayloadType.JoinChatChannel) {
    const e = event as GatewayXboxMessageJoinChatChannel

    client.emit('channelJoin', e)

  }

}