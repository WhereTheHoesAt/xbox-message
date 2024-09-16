import { PartContentType, XboxMessage } from '../..'
import { GatewayImageContentPart } from '../../ws'

import { BasePart } from './BasePart'

export type APIImagePart = {
  contentType: string,
  version: number,
  attachmentId: string,
  filetype: string,
  sizeInBytes: number,
  hash: string,
  height: number,
  width: number
}

export class ImagePart extends BasePart {

  public type: PartContentType.Image

  public id: string

  public url: string

  public hash: string

  public height: number

  public width: number

  public size: number

  public filetype: string

  constructor(client: XboxMessage, data: GatewayImageContentPart) {

    super(client, data)

    this.type = data.contentType

    this.id = data.attachmentId

    this.url = data.downloadUri

    this.hash = data.hash

    this.height = data.height

    this.width = data.width

    this.size = data.sizeInBytes

    this.filetype = data.filetype

  }

}