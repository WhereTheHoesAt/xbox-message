import { XboxMessage } from '..'

import { GatewayNotificationInboxResponse } from '../ws'

export default (client: XboxMessage, event: GatewayNotificationInboxResponse) => {
    client.emit("event", event);
}