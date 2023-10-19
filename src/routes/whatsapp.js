import { Router } from 'express'
import Voter from '../models/Factory/VoterFactory.js'
import { validateToken } from '../middlewares/validateToken.js'
import cl from 'picocolors'
import Survey from '../models/Factory/SurveyFactory.js'

import { create } from 'venom-bot'

const router = Router()

async function WhatsAppBot (socketIo) {
  let qrCodeData = null
  let client = null
  let isConnected = false
  let surveys = await getAllSurveys()
  client = await initSessionVotos()

  async function initSessionVotos () {
    const clientInitial = await create(
      'sessionVotos',
      (base64Qrimg, asciiQR, attempts, urlCode) => {
        console.log('Number of attempts to read the qrcode: ', attempts)
        qrCodeData = base64Qrimg
        console.log(cl.green('✅ QR code generated.'))
        socketIo.emit('qrcodeResponse', qrCodeData)
      },
      (statusSession, session) => {
        console.log('Status Session: ', statusSession)
        if (statusSession.includes('qrReadSuccess') || statusSession.includes('successChat')) {
          console.log(cl.green('✅ Client Autenticathed!'))
          isConnected = true
          socketIo.emit('clientIsReady', isConnected)
        }

        if (statusSession.includes('qrReadFail')) {
          console.log(cl.green('❌ No se ha conectado!'))
          isConnected = false
          qrCodeData = null
          socketIo.emit('clientIsReady', isConnected)
          time = setTimeout(() => {
            client = initSessionVotos()
          }, 10000)
        }
      },
      {
        logQR: false
      }
    )
    return clientInitial
  }

  client.onStateChange((state) => {
    console.log('State changed: ', state)
    // force whatsapp take over
    if ('CONFLICT'.includes(state)) client.useHere()
    // detect disconnect on whatsapp
    if ('UNPAIRED'.includes(state)) console.log('logout')
  })

  // DISCONNECTED
  // SYNCING
  // RESUMING
  // CONNECTED
  let time = 0
  client.onStreamChange((state) => {
    console.log('State Connection Stream: ' + state)
    clearTimeout(time)
    if (state === 'DISCONNECTED' || state === 'SYNCING') {
      console.log(cl.green('❌ Se ha cerrado la session!'))
      isConnected = false
      qrCodeData = null
      socketIo.emit('clientIsReady', isConnected)
      time = setTimeout(() => {
        client.close()
        client = initSessionVotos()
      }, 10000)
    }
  })

  async function enviarMensaje (from, txt) {
    client.sendText(from, txt)
      .then((result) => {
        console.log('Result: ', result) // return object success
      })
      .catch((erro) => { console.error('Error when sending: ', erro) })
  }

  client.onMessage(async (message) => {
    if (message.body === '' || message.body === undefined) return false

    if (message.body.includes('#') && message.isGroupMsg === false) {
      const encuesta = await surveys.find(survey => (survey.code === message.body))

      if (!encuesta?.id) return false

      const voter = await Voter.getByPhone(message.from)
      const infoVoter = JSON.parse(encuesta.info)
      const field = 0
      let count = 0
      let responseInfo
      for (const key in infoVoter) {
        if (count === field) {
          responseInfo = infoVoter[key]
        }
        count++
      }
      if (voter?.id) {
        const updatedItem = {
          id: voter.id,
          step: `txtInfo-${field}`,
          vote: null,
          info: {},
          survey_id: encuesta.id
        }
        await Voter.updateItem(updatedItem).then(() => enviarMensaje(message.from, encuesta.txtInicio))
      } else {
        const createItem = {
          from: 'WhatsApp',
          phone: message.from,
          step: `txtInfo-${field}`,
          vote: null,
          info: {},
          survey_id: encuesta.id
        }
        Voter.createItem(createItem).then(() => enviarMensaje(message.from, encuesta.txtInicio))
      }
      setTimeout(() => {
        enviarMensaje(message.from, responseInfo)
      }, 1000)
    } else {
      if (message.body === '' || message.isGroupMsg) return false

      const voter = await Voter.getByPhone(message.from)
      if (!voter?.id) return false

      if (voter?.id) {
        const updatedItem = {
          id: voter.id,
          step: voter.step,
          vote: voter.vote,
          info: JSON.parse(voter.info)
        }
        if (voter.step === 'txtWelcome') {
          let validateResponse = false
          if (message.body.toLowerCase().trim() === 'si') {
            validateResponse = true
            updatedItem.vote = 1
          }
          if (message.body.toLowerCase().trim() === 'no') {
            validateResponse = true
            updatedItem.vote = 0
          }

          let response
          if (validateResponse) {
            response = (updatedItem.vote) ? voter['Survey.txtYes'] : voter['Survey.txtNo']
            const response2 = voter['Survey.txtEnd']
            updatedItem.step = 'txtEnd'
            await Voter.updateItem(updatedItem).then(item => {
              enviarMensaje(message.from, response)
              setTimeout(() => {
                enviarMensaje(message.from, response2)
              }, 1000)
            })
          } else {
            response = 'Para que la respuesta sea válida, responde Si, o No.'
            enviarMensaje(message.from, response)
          }
        }
        if (voter.step.includes('txtInfo')) {
          // capturar el paso en el que voy
          let nexStep = voter.step.replace('txtInfo-', '')
          const actualStep = parseInt(nexStep)
          nexStep = actualStep + 1
          console.log('actualStep: ', actualStep)
          console.log('nexStep: ', nexStep)

          const infoVoter = JSON.parse(voter['Survey.info'])

          let count = 0
          let responseInfo = ''
          let llave
          for (const key in infoVoter) {
            if (count === actualStep) {
              llave = key
            }
            if (count === nexStep) {
              responseInfo = infoVoter[key]
            }
            count++
          }
          updatedItem.step = `txtInfo-${nexStep}`

          // guardar info [step] del votante para campo [step] de la survey
          const arrayInfo = updatedItem.info
          arrayInfo[llave] = message.body
          updatedItem.info = arrayInfo
          if (responseInfo === '') updatedItem.step = 'txtWelcome'
          const saveInfo = await Voter.updateItem(updatedItem)
          if (saveInfo) {
            if (responseInfo === '') responseInfo = voter['Survey.txtWelcome']
            enviarMensaje(message.from, responseInfo)
          }
        }
      }
      // si message.body no tiene #
    }
  })

  async function sendMessageToClient (fullPhone, message) {
    await client.sendText(fullPhone + '@c.us', message).then((result) => {
      console.log('Result: ', result) // return object success
    })
      .catch((erro) => {
        console.error('Error when sending: ', erro) // return object error
      })
  }

  async function getSurveys () {
    surveys = await getAllSurveys()
    return surveys
  }

  return {
    sendMessageToClient,
    getSurveys,
    isConnected,
    qrCodeData
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
  const botWhatsapp = WhatsAppBot(socketIo);

  (async () => {
    console.log(await botWhatsapp.getConnected)
  })()

  router.get('/sendmessage', validateToken, async (req, res) => {
    const allSurveys = await (await botWhatsapp).getSurveys();
    (await botWhatsapp).sendMessageToClient('573001949038', JSON.stringify(allSurveys))
  })

  router.get('/qrcode', validateToken, async (req, res) => {
    // Verificar si el cliente está conectado mediante el código QR
    const connected = (await botWhatsapp).isConnected
    const qrCode = (await botWhatsapp).qrCodeData

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
