import debugFn from 'debug'
import { WebSocket, type Data } from 'ws'

import { ChannelType, ConversationType, MessageType, PartContentType, PayloadType, XboxMessage } from '.'

import handlers from './handlers'
import { XboxMessageError, XboxMessageErrorCodes } from './classes/errors/XboxMessageError'

const debug = debugFn('xbox-message')

export type GatewayContentParts =
  | GatewayTextContentPart
  | GatewayWeblinkContentPart
  | GatewayImageContentPart
  | GatewayFeedItemContentPart
  | GatewayWeblinkMediaContentPart
  | GatewayVoiceContentPart
  | GatewayDirectMentionContentPart;

export type GatewayVoiceContentPart = {
  contentType: PartContentType.Voice;
  version: number;
  duration: number;
  voiceAttachmentId: string;
};

export type GatewayWeblinkMediaContentPart = {
  contentType: PartContentType.WeblinkMedia;
  mediaType: string;
  mediaUri: string;
  text: string;
  version: number;
  unsuitableFor: string[];
};

export type GatewayFeedItemContentPart = {
  contentType: PartContentType.FeedItem;
  version: number;
  locator: string;
};

export type GatewayImageContentPart = {
  contentType: PartContentType.Image;
  version: number;
  attachmentId: string;
  filetype: string;
  sizeInBytes: number;
  hash: string;
  height: number;
  width: number;
  downloadUri: string;
  unsuitableFor: string[];
};

export type GatewayWeblinkContentPart = {
  contentType: PartContentType.Weblink;
  version: number;
  text: string;
  unsuitableFor: string[];
};

export type GatewayTextContentPart = {
  contentType: PartContentType.Text;
  version: number;
  text: string;
  unsuitableFor: string[];
};

export type GatewayDirectMentionContentPart = {
  contentType: PartContentType.DirectMention;
  version: number;
  text: string;
  xuid: string;
  unsuitableFor: string[];
};

export type BaseGatewayEvent = {
  clientSeqNum: number;
  messageTime: string;
  senderXuid: string;
  senderGamertag: string;
};

export type GatewayBasicTextResponse = BaseGatewayEvent & {
  messageType: MessageType.BasicText;
  channel: GatewayChannelGroupMessage;
  payload: {
    contentPayload: GatewayContentPayload;
  };
};

export type GatewayHorizonsResponse = BaseGatewayEvent & {
  messageType: MessageType.Horizons;
  messageId: string;
  channel: GatewayChannelGroupMessage;
  recipientFilter: string[];
  horizons: {
    consumptionHorizon: string;
    directMentionHorizon: string;
    clearHorizon: string;
  };
};

export type GatewayNoOpResponse = BaseGatewayEvent & {
  messageType: MessageType.NoOp;
  messageId: string;
  channel: GatewayChannelSystem;
  flagServerOriginated: true;
};

export type GatewayJoinChannelResponse = BaseGatewayEvent & {
  messageType: MessageType.JoinChannel;
  messageId: string;
  channel: GatewayChannelXboxMessage | GatewayChannelGroupMessage;
  flagLurk: boolean;
  connectionId: string;
};


export type GatewayLeaveChannelResponse = BaseGatewayEvent & {
  messageType: MessageType.LeaveChannel;
  messageId: string;
  channel: GatewayChannelXboxMessage | GatewayChannelGroupMessage;
  flagServerOriginated: true;
  connectionId: string;
};

export type GatewayWhoAmIResponse = BaseGatewayEvent & {
  messageType: MessageType.WhoAmI;
  messageId: string;
  channel: GatewayChannelSystem;
  connectionId: string;
  serverNonce: string;
};

export type GatewayEventResponse =
  | GatewayXboxMessageResponse
  | GatewayUserInfoResponse
  | GatewayBasicTextResponse
  | GatewayHorizonsResponse
  | GatewayNoOpResponse
  | GatewayJoinChannelResponse
  | GatewayLeaveChannelResponse
  | GatewayWhoAmIResponse

export type GatewayWhoAmIRequest = {
  messageType: MessageType.WhoAmI;
  channel: GatewayChannelSystem;
  clientSeqNum: number
}

export type GatewayJoinChannelRequest = {
  messageType: MessageType.JoinChannel;
  channel: GatewayChannelXboxMessage | GatewayChannelGroupMessage;
  flagLurk: boolean;
  clientSeqNum: number
}

export type GatewayEventRequest =
  | GatewayWhoAmIRequest
  | GatewayJoinChannelRequest

export type GatewayChannelSystem = {
  type: ChannelType.System;
};

export type GatewayChannelXboxMessage = {
  type: ChannelType.XboxMessage;
  id: string;
};

export type GatewayChannelGroupMessage = {
  type: ChannelType.GroupMessage;
  id: string;
};

export type GatewayBasePayload = {
  timestamp: string;
  lastUpdateTimestamp: string;
  type: PayloadType;
  networkId: string;
  conversationType: ConversationType;
  conversationId: string;
  messageId: string;
  clock: string;
  isDeleted: boolean;
  isServerUpdated: boolean;
};

export type GatewayContentMessagePayload = GatewayBasePayload & {
  type: PayloadType.ContentMessage;
  contentPayload: {
    content: {
      parts: GatewayContentParts[];
    }
  }
  sender: string
  owner: number
  notifyPayload: {
    shouldToast: boolean,
    folder: string,
    muted: boolean,
    conversationName: string,
    isOffensive: boolean
  }
  directMentionPayload?: { users: number[] }
  notificationPayload?: ConversationType.OneToOne extends ConversationType ?
  {
    shouldToast: boolean;
    folder: string;
    muted: boolean;
    conversationName: string;
    isOffensive: boolean;
  } :
  never;
};

export type GatewayJoinChatChannelPayload = GatewayBasePayload & {
  type: PayloadType.JoinChatChannel;
  joinChatChannelPayload: { groupId: string, channelId: string },
  sender: string;
  owner: number;
};

export type GatewaySetHorizonPayload = GatewayBasePayload & {
  type: PayloadType.SetHorizon;
  setHorizonPayload: {
    conversations: {
      conversationId: string;
      channel: {
        groupId: string;
        channelId: string;
      };
      conversationType: ConversationType;
      horizon: string;
      horizonType: 'Read';
    }[];
  }
  owner: number;
  notifyPayload: {
    shouldToast: false;
    muted: false;
    isOffensive: false;
  };
  notificationPayload: {
    shouldToast: false;
    muted: false;
    isOffensive: false;
  }
};

export type GatewayXboxMessageResponse =
  | GatewayXboxMessageContentMessage
  | GatewayXboxMessageSetHorizon
  | GatewayXboxMessageJoinChatChannel

export type GatewayXboxMessageBaseResponse = BaseGatewayEvent & {
  messageType: MessageType.XboxMessage;
  channel: GatewayChannelXboxMessage;
  flagServerOriginated: true;
};

export type GatewayXboxMessageContentMessage = GatewayXboxMessageBaseResponse & {
  payload: GatewayContentMessagePayload
}

export type GatewayXboxMessageSetHorizon = GatewayXboxMessageBaseResponse & {
  payload: GatewaySetHorizonPayload
}

export type GatewayXboxMessageJoinChatChannel = GatewayXboxMessageBaseResponse & {
  payload: GatewayJoinChatChannelPayload
}

export type GatewayUserInfoPermissions = {
  canRead: boolean;
  canWrite: boolean;
  canModerate: boolean;
  canSetMotd: boolean;
};

export type GatewayUserInfoResponse = BaseGatewayEvent & {
  messageType: MessageType.UserInfo;
  messageId: string;
  channel: GatewayChannelXboxMessage | GatewayChannelGroupMessage;
  flagServerOriginated: true;
  permissions: GatewayUserInfoPermissions;
  connectionId: string;
};

export type GatewayContentPayload = {
  content: {
    parts: GatewayContentParts[];
  };
  timestamp: string;
  lastUpdateTimestamp: string;
  type: PayloadType.ContentMessage;
  networkId: 'Xbox';
  conversationType: ConversationType;
  conversationId: string;
  sender: string;
  messageId: string;
  clock: string;
  isDeleted: boolean;
  isServerUpdated: boolean;
};

export class WebsocketManager {

  public client: XboxMessage

  private ws: WebSocket | null = null

  private heartbeatTimeout: NodeJS.Timeout | null = null

  private reconnectTimeout: NodeJS.Timeout | null = null

  private _sequenceId = 0

  constructor(client: XboxMessage) {

    this.client = client

  }

  get sequenceId() {
    return this._sequenceId++
  }

  async connect() {
    if (this.ws?.readyState === WebSocket.OPEN) throw new XboxMessageError(XboxMessageErrorCodes.WebsocketAlreadyConnected)

    const xbl = await this.client.authflow.getXboxToken()

    const authKey = await this.client.rest.getAuthKey(xbl.userXUID)

    const address = `wss://chat.xboxlive.com/users/xuid(${xbl.userXUID})/chat/connect?AuthKey=${authKey}`

    debug(`Connecting to ${address}?AuthKey=${authKey}`)

    const ws = new WebSocket(address, 'chat')

    ws.onopen = () => {
      this.onOpen()
    }

    ws.onclose = (event) => {
      this.onClose(event.code, event.reason)
    }

    ws.onerror = (event) => {
      this.onError(event.error)
    }

    ws.onmessage = (event) => {
      this.onMessage(event.data)
    }

    this.ws = ws

  }

  async destroy(resume = false) {

    debug('Disconnecting from chat.xboxlive.com')

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout)
      this.heartbeatTimeout = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {

      this.ws.onmessage = null
      this.ws.onclose = null

      const shouldClose = this.ws.readyState === WebSocket.OPEN

      if (shouldClose) {
        let outerResolve: () => void

        const promise = new Promise<void>((resolve) => {
          outerResolve = resolve
        })

        this.ws.onclose = outerResolve!

        this.ws.close(1000, 'Normal Closure')

        await promise
      }

      this.ws.onerror = null
    }

    if (resume) {
      return this.connect()
    }


  }

  send(payload: GatewayEventRequest) {
    const data = JSON.stringify(payload)

    debug('Sending', data)

    if (this.ws) {
      this.ws.send(data)
    }

  }


  private onOpen() {
    debug('Client Connected to chat.xboxlive.com')

    this.reconnectTimeout = setTimeout(() => {
      debug('Reconnecting to chat.xboxlive.com')

      this.destroy(true)
    }, 90 * 60 * 1000) // 90 minutes

    this.send({ messageType: MessageType.WhoAmI, channel: { type: ChannelType.System }, clientSeqNum: this.sequenceId })

  }

  private onError(err: Error) {
    debug('Websocket Error', err)
  }

  private onClose(code: number, reason: string) {
    debug(`Websocket Disconnected from chat.xboxlive.com with code ${code} and reason ${reason}`)

    if (code === 1006) {
      debug('Websocket Connection Closed Unexpectedly')


      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout)
      }

      this.destroy(true)
    }
  }

  private onMessage(res: Data) {

    if (!(typeof res === 'string')) {
      debug('received non-string message', res)
      return
    }

    const event = JSON.parse(res) as GatewayEventResponse

    debug('received message', res)

    this.client.emit('event', event)

    if (event.messageType && handlers[event.messageType]) {
      handlers[event.messageType](this.client, event)
    }

  }

}