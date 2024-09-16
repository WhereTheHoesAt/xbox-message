import { PartContentType, XboxMessage } from '../..'
import { GatewayWeblinkMediaContentPart } from '../../ws'

import { BasePart } from './BasePart'

export class WeblinkMediaPart extends BasePart {

  public type: PartContentType.WeblinkMedia

  public text: string

  public url: string

  public mediaType: string

  constructor(client: XboxMessage, data: GatewayWeblinkMediaContentPart) {

    super(client, data)

    this.type = data.contentType

    this.text = data.text

    this.url = data.mediaUri

    this.mediaType = data.mediaType

  }

}