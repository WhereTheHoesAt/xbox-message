import NoOpHandler from './NoOp'

import WhoAmIHandler from './WhoAmI'

import HorizonsHandler from './Horizons'

import UserInfoHandler from './UserInfo'

import BasicTextHandler from './BasicText'

import JoinChannelHandler from './JoinChannel'

import XboxMessageHandler from './XboxMessage'

import LeaveChannelHandler from './LeaveChannel'

import NotificationInboxHandler from './NotificationInbox'

import { MessageType, XboxMessage } from '..'

const handlers: Record<MessageType, (client: XboxMessage, event: any) => void> = {
  [MessageType.Horizons]: HorizonsHandler,
  [MessageType.JoinChannel]: JoinChannelHandler,
  [MessageType.NoOp]: NoOpHandler,
  [MessageType.UserInfo]: UserInfoHandler,
  [MessageType.WhoAmI]: WhoAmIHandler,
  [MessageType.XboxMessage]: XboxMessageHandler,
  [MessageType.BasicText]: BasicTextHandler,
  [MessageType.LeaveChannel]: LeaveChannelHandler,
  [MessageType.NotificationInbox]: NotificationInboxHandler
}

export default handlers
