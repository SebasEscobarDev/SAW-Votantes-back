import { Router } from 'express'
import wppweb from 'whatsapp-web.js'
// import qrcode from 'qrcode-terminal';
import qrcode from 'qrcode'
// import Voter from '../models/Factory/VoterFactory.js'
import { validateToken } from '../middlewares/validateToken.js'
import cl from 'picocolors'
import Survey from '../models/Factory/SurveyFactory.js'

const { Client, LocalAuth } = wppweb
const router = Router()

let qrCodeData = null
let isConnected = false
let client
const surveys = getAllSurveys()

async function getAllSurveys () {
  // paginacion
  const options = {}
  options.results = 10
  options.page = 1
  return await Survey.getAll(options)
}

async function generateQRCode (data) {
  try {
    const qrCodeURL = await qrcode.toDataURL(data, { errorCorrectionLevel: 'H' })
    return qrCodeURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

async function whatsappFunctions (io) {
  qrCodeData = null
  isConnected = false

  client = new Client({
    authStrategy: new LocalAuth()
  })

  client.on('authenticated', () => {
    console.log(cl.green('✅ Client Autenticathed!'))
    isConnected = true
    io.emit('clientIsReady', isConnected)
  })

  client.on('qr', async qr => {
    qrCodeData = await generateQRCode(qr)
    console.log(cl.green('✅ QR code generated.'))
    io.emit('qrcodeResponse', qrCodeData)
  })

  client.on('ready', () => {
    console.log(cl.green('✅ Client is ready!'))
    isConnected = true
    io.emit('clientIsReady', isConnected)
  })

  client.on('message', async (message) => {
    if (message.body === '') return
    // const contacto = await message.getContact()
    // const formatNumber = await contacto.getFormattedNumber()
    // const countryCode = await contacto.getCountryCode()
    // const chat            = await contacto.getChat();
    // const info            = await message.getInfo();
    // const avatar = await contacto.getProfilePicUrl()
    // io.emit('messageResponse', msn)

    // const item = {
    //   from: 'whatsapp',
    //   phone: contacto.id.user ?? '---',
    //   frmPhone: formatNumber ?? '---'
    // }
    // await Voter.createItem(item)
    // console.log(cl.green('Voto Creado'))
    console.log(surveys)
  })

  client.on('disconnected', () => {
    console.log(cl.red('disconnected'))
    isConnected = false
    qrCodeData = null
    client.destroy()
      .then(() => {
        whatsappFunctions(io)
        io.emit('clientIsReady', isConnected)
      })
      .catch((e) => console.log(e))
  })

  await client.initialize()

  function sendMessageToClient (fullPhone, message) {
    client.sendMessage(fullPhone + '@c.us', message)
  }
  return {
    sendMessageToClient
  }
}

export default function whatsappRoutes (io) {
  async function getWhatsappFuncs () {
    return await whatsappFunctions(io)
  }

  const whatsappFuncs = getWhatsappFuncs()

  if (whatsappFuncs) {
    router.get('/sendmessage', validateToken, async (req, res) => {
      whatsappFuncs.sendMessageToClient('573148406835', 'Prueba de Texto')
    })
  }

  router.get('/qrcode', validateToken, async (req, res) => {
    // Verificar si el cliente está conectado mediante el código QR
    if (!isConnected) {
      if (qrCodeData) {
        return res.status(200).json({ qrCode: qrCodeData })
      } else {
        return res.status(404).json({ error: 'QR code not available' })
      }
    } else {
      return res.status(200).json({ connected: true })
    }
  })

  return router
}
