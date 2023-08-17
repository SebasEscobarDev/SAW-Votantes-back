import { Router } from 'express'
import wppweb from 'whatsapp-web.js'
// import qrcode from 'qrcode-terminal';
import qrcode from 'qrcode'
import Agent from '../models/Factory/AgentFactory.js'
import Contact from '../models/Factory/ContactFactory.js'
import moment from 'moment'
// import { sendContacts } from '../controllers/agents.js'
import { validateToken } from '../middlewares/validateToken.js'
import cl from 'picocolors'

const { Client, LocalAuth } = wppweb

const router = Router()

let qrCodeData = null
let isConnected = false
let sendContactsToAgent = false
let activeAgents = Agent.getActiveAgents()
let client

async function generateQRCode (data) {
  try {
    const qrCodeURL = await qrcode.toDataURL(data, { errorCorrectionLevel: 'H' })
    return qrCodeURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

function whatsappFunctions (io) {
  qrCodeData = null
  isConnected = false
  sendContactsToAgent = false
  activeAgents = Agent.getActiveAgents()

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
    const contacto = await message.getContact()
    const formatNumber = await contacto.getFormattedNumber()
    const countryCode = await contacto.getCountryCode()
    // const chat            = await contacto.getChat();
    // const info            = await message.getInfo();
    const avatar = await contacto.getProfilePicUrl()
    // io.emit('messageResponse', msn)

    const historialArray = []

    const historial = {
      date: moment(new Date()).utcOffset('-0500').format('YYYY-MM-DD HH:mm:ss'),
      message: message.body
    }
    historialArray.push(historial)

    console.log({ name: contacto.pushname, ...historial })

    const contact = {
      device_type: message.deviceType ?? '---',
      country_code: countryCode ?? '---',
      full_phone: contacto.id.user ?? '---',
      formatted_phone: formatNumber ?? '---',
      name: contacto.name ?? '---',
      pushname: contacto.pushname ?? '---',
      avatar: avatar ?? '---',
      historial: JSON.stringify(historialArray)
    }
    await Contact.createContact(contact)
    console.log(cl.yellow(sendContactsToAgent))
    if (sendContactsToAgent) {
      // enviar contacto a agentes activos en orden.
      if (activeAgents) {
        console.log(cl.bgGreen(activeAgents))
      }
    }
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

  client.initialize()

  function sendMessageToClient (fullPhone, message) {
    client.sendMessage(fullPhone + '@c.us', message)
  }
  return {
    sendMessageToClient
  }
}

export default function whatsappRoutes (io) {
  const whatsappFuncs = whatsappFunctions(io)

  // Ahora puedes usar las funciones definidas y acceder a la variable 'client'
  // whatsappFuncs.sendMessageToClient("Hola, esto es un mensaje desde fuera");

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

  // router.post('/sendcontacts', validateToken, sendContacts)

  router.post('/sendauto', validateToken, async (req, res) => {
    if (req.body.active) {
      sendContactsToAgent = true
      // enviar contactos no enviados
      const sending = await sendUnsentContacts()
      // if( sending ){
      //   sending.map(contact=>{

      //   })
      // }
      whatsappFuncs.sendMessageToClient('573148406835', JSON.stringify(sending))
      return res.status(200).json({ message: 'Envio automatico Activado' })
    } else {
      sendContactsToAgent = false
      return res.status(200).json({ message: 'Envio automatico Desactivado' })
    }
  })

  return router
}

const sendUnsentContacts = async (activeAgents) => {
  const idContacts = await Contact.getUnsentContacts()
  return idContacts
}
