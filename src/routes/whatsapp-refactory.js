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

async function WhatsAppBot (socketIo) {
  let qrCodeData = null
  let isConnected = false
  const surveys = await getAllSurveys()
  let client = await initializeClient()

  client.on('authenticated', () => {
    console.log(cl.green('✅ Client Autenticathed!'))
    isConnected = true
    socketIo.emit('clientIsReady', isConnected)
  })

  client.on('qr', async qr => {
    qrCodeData = await qrcode.toDataURL(qr, { errorCorrectionLevel: 'H' })
    console.log(cl.green('✅ QR code generated.'))
    socketIo.emit('qrcodeResponse', qrCodeData)
  })

  client.on('ready', () => {
    console.log(cl.green('✅ Client is ready!'))
    isConnected = true
    socketIo.emit('clientIsReady', isConnected)
  })

  client.on('message', async (message) => {
    if (message.body === '') return
    console.log(surveys)
  })

  client.on('disconnected', async () => {
    console.log(cl.red('disconnected'))
    isConnected = false
    qrCodeData = null
    client = await restartClient()
  })

  function initializeClient () {
    const client = new Client({
      authStrategy: new LocalAuth()
    })

    client.initialize()

    return client
  }

  async function restartClient () {
    console.log('Reconnecting to WhatsApp...')
    return await initializeClient()
  }

  async function sendMessageToClient (fullPhone, message) {
    client.sendMessage(fullPhone + '@c.us', message)
  }

  async function getConnected () {
    return isConnected
  }

  async function getQrCode () {
    return qrCodeData
  }

  return {
    sendMessageToClient,
    getConnected,
    getQrCode
  }
}

async function getAllSurveys () {
  // paginacion
  const options = {}
  options.results = 10
  options.page = 1
  return await Survey.getAll(options)
}

export default function whatsappRoutes (socketIo) {
  const botWhatsapp = WhatsAppBot(socketIo)

  router.get('/sendmessage', validateToken, async (req, res) => {
    if (botWhatsapp) botWhatsapp.sendMessageToClient('573148406835', 'Cliente iniciado con exito')
  })

  router.get('/qrcode', validateToken, async (req, res) => {
    // Verificar si el cliente está conectado mediante el código QR
    const connected = await botWhatsapp.getConnected()
    console.log(connected)
    const qrCode = await botWhatsapp.getQrCode()
    console.log(qrCode)

    if (!connected) {
      if (qrCode !== null && qrCode !== undefined) {
        return res.status(200).json({ qrCode })
      } else {
        return res.status(404).json({ error: 'QR code not available' })
      }
    } else {
      return res.status(200).json({ connected: true })
    }
  })

  return router
}
