// import debugFn from 'debug'
import { TypedEmitter } from 'tiny-typed-emitter'
import { Authflow, Titles } from 'prismarine-auth'

export enum ChannelType {
  System = 'System',
  GroupMessage = 'GroupMessage',
  XboxMessage = 'XboxMessage',
  NotificationInbox = 'NotificationInbox'
}

export enum PayloadType {
  ContentMessage = 'ContentMessage',
  SetHorizon = 'SetHorizon',
  JoinChatChannel = 'JoinChatChannel',
}

export enum ConversationType {
  Group = 'Group',
  OneToOne = 'OneToOne',
}

export enum MessageType {
  WhoAmI = 'WhoAmI',
  JoinChannel = 'JoinChannel',
  LeaveChannel = 'LeaveChannel',
  UserInfo = 'UserInfo',
  BasicText = 'BasicText',
  Horizons = 'Horizons',
  XboxMessage = 'XboxMessage',
  NoOp = 'NoOp',
  NotificationInbox = "NotificationInbox"
}

export enum PartContentType {
  Text = 'text',
  Weblink = 'weblink',
  Image = 'image',
  FeedItem = 'feedItem',
  WeblinkMedia = 'weblinkMedia',
  Voice = 'voice',
  DirectMention = 'directMention',
}

export enum PushNotificationType {
  NewAction = 'NewAction'
}

export enum SubscriptionType {
  PartyInvites = 'PartyInvites'
}

export enum SubscriptionCategory {
  Multiplayer = "Microsoft.Xbox.Multiplayer"
}

export type XboxMessageOptions = {
  cacheIdentifier?: string
  cachePath?: string
  authflow?: Authflow
}

import { Rest } from './rest'
import { GatewayEventResponse, WebsocketManager, GatewayXboxMessageJoinChatChannel } from './ws'

import { User } from './classes/User'
import { Message } from './classes/Message'
import { UserManager } from './classes/managers/UserManager'
import { ConversationManager } from './classes/managers/ConversationManager'
import { GroupManager } from './classes/managers/GroupManager'

interface MessageEvents {
  event: (event: GatewayEventResponse) => void;
  message: (message: Message) => void;
  messageDelete: (message: Message) => void;
  channelJoin: (event: GatewayXboxMessageJoinChatChannel) => void;
}

// const debug = debugFn('xbox-message')

export class XboxMessage extends TypedEmitter<MessageEvents> {

  public rest: Rest

  public users: UserManager

  public conversations: ConversationManager

  public groups: GroupManager

  public authflow: Authflow

  public ws: WebsocketManager

  public user: User | null = null

  constructor(options?: XboxMessageOptions) {
    super()

    this.authflow = options?.authflow ?? new Authflow(options?.cacheIdentifier, options?.cachePath, { flow: 'sisu', authTitle: Titles.XboxAppIOS, deviceType: 'iOS' })

    this.rest = new Rest(this)

    this.users = new UserManager(this)

    this.conversations = new ConversationManager(this)

    this.groups = new GroupManager(this)

    this.ws = new WebsocketManager(this)

  }

  async connect() {

    const xbl = await this.authflow.getXboxToken()

    this.user = await this.users.fetch(xbl.userXUID)

    const [groups, conversations] = await Promise.all([
      this.rest.getGroups(),
      this.rest.getConversations(),
    ])

    for (const group of groups.groups) {
      this.groups.add(group)
    }

    for (const conversation of conversations.conversations) {
      this.conversations.add(conversation)
    }

    const userIds = Array.from(new Set(conversations.conversations.flatMap(c => c.participants)))

    if (userIds.length > 0) {
      await this.users.fetchMany(userIds)
    }

    await this.ws.connect()
  }

  async destroy(resume = false) {
    await this.ws.destroy(resume)
  }

}

export * from './ws'
export * from './rest'

export * from './classes/errors/XboxMessageError'

export * from './classes/managers/UserManager'
export * from './classes/managers/ConversationManager'
export * from './classes/managers/GroupManager'
export * from './classes/managers/MessageManager'

export * from './classes/MessagePayload'
export * from './classes/MessageEntity'
export * from './classes/Message'
export * from './classes/User'
export * from './classes/Group'

export * from './classes/Conversation/BaseConversation'
export * from './classes/Conversation/GroupConversation'
export * from './classes/Conversation/OneToOneConversation'

export * from './classes/Parts/BasePart'
export * from './classes/Parts/DirectMentionPart'
export * from './classes/Parts/FeedItemPart'
export * from './classes/Parts/ImagePart'
export * from './classes/Parts/TextPart'
export * from './classes/Parts/UnknownPart'
export * from './classes/Parts/VoicePart'
export * from './classes/Parts/WeblinkMediaPart'
export * from './classes/Parts/WeblinkPart'
