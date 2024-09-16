export enum XboxMessageErrorCodes {
  Debug = 'Debug',
  InvalidConversationType = 'InvalidConversationType',
  MissingMessageParts = 'MissingMessageParts',
  MessageRecipientNotFound = 'MessageRecipientNotFound',
  MessageGroupNotFound = 'MessageGroupNotFound',
  MessageNotFound = 'MessageNotFound',
  ConversationNotFound = 'ConversationNotFound',
  WebsocketAlreadyConnected = 'WebsocketAlreadyConnected',
}

export const XboxMessageErrorMessages: Record<XboxMessageErrorCodes, string | ((...args: any[]) => string)> = {
  [XboxMessageErrorCodes.Debug]: 'Debug',
  [XboxMessageErrorCodes.InvalidConversationType]: (type: string) => `Invalid conversation type: ${type}`,
  [XboxMessageErrorCodes.MissingMessageParts]: 'Message must have at least one part',
  [XboxMessageErrorCodes.MessageRecipientNotFound]: 'Message recipient not found',
  [XboxMessageErrorCodes.MessageGroupNotFound]: 'Message group not found',
  [XboxMessageErrorCodes.MessageNotFound]: 'Message not found',
  [XboxMessageErrorCodes.ConversationNotFound]: 'Conversation not found',
  [XboxMessageErrorCodes.WebsocketAlreadyConnected]: 'Websocket already connected',
}

export class XboxMessageError extends Error {

  public code: XboxMessageErrorCodes

  constructor(code: XboxMessageErrorCodes, ...args: any[]) {
    super(XboxMessageError.getMessage(code, args))

    this.code = code

    Error.captureStackTrace?.(this, XboxMessageError)

  }

  get name() {
    return `${super.name} [${this.code}]`
  }

  static getMessage(code: XboxMessageErrorCodes, args: any[]) {
    if (!(code in XboxMessageErrorCodes)) throw new Error('Error code must be a valid XboxMessageErrorCodes')
    const msg = XboxMessageErrorMessages[code]
    if (!msg) throw new Error(`No message associated with error code: ${code}.`)
    if (typeof msg === 'function') return msg(...args)
    if (!args?.length) return msg
    args.unshift(msg)
    return String(...args)
  }

}
