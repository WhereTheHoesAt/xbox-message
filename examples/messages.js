process.env.DEBUG = 'xbox-message'

const { Authflow, Titles } = require('prismarine-auth')
const { XboxMessage } = require('xbox-message')

const fs = require('fs')

const img = fs.readFileSync('./examples/img.jpg')

const main = async () => {

  const authflow = new Authflow('example', './', { flow: 'sisu', authTitle: Titles.XboxAppIOS, deviceType: 'iOS' })

  const client = new XboxMessage({ authflow: authflow })

  client.on('message', async (message) => {

    if (message.userId === client.user.id) {
      console.log('This is my message')
      return
    }

    // await message.conversation.send({ attachment: { data: img, fileType: 'jpg' } })
    //   .catch((err) => {
    //     console.error('Error: ' + (err.response ?? err))
    //   })

    await message.conversation.send({ content: 'Hello' })
      .catch((err) => {
        console.error(err.response ?? err)
      })


  })

  client.on('messageDelete', async (message) => {
    console.log(`Deleted: ${message.content}`)
  })

  await client.connect()

}

main()