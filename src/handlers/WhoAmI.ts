import { ChannelType, MessageType, XboxMessage } from '..'

import { GatewayWhoAmIResponse } from '../ws'

export default (client: XboxMessage, event: GatewayWhoAmIResponse) => {
  client.ws.send({ messageType: MessageType.JoinChannel, channel: { id: event.senderXuid, type: ChannelType.XboxMessage }, flagLurk: true, clientSeqNum: client.ws.sequenceId })
}