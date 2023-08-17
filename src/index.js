import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { config as dotenv } from 'dotenv'
// conectar db
import { sequelize } from './database/db.js'
// rutas
import usersRoutes from './routes/users.js'
import countriesRoutes from './routes/countries.js'
import approvedRoutes from './routes/approvedNums.js'
import contactsRoutes from './routes/contacts.js'
import agentsRoutes from './routes/agents.js'
import whatsappRoutes from './routes/whatsapp.js'
// agregar asosiaciones db
import './models/associations.js'
// socket server
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { configureSocketIO } from './routes/socketIOHandler.js'
import cl from 'picocolors'

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:8000'
  }
})

dotenv()
app.set('port', process.env.APP_PORT)
app.use(morgan('dev'))
app.use(cors())
// app.use( session({secret: '123456', resave: true, saveUninitialized: true}) );
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// socket
await configureSocketIO(io)
const wppIoRoutes = whatsappRoutes(io)
// usar rutas
app.use('/api/users', usersRoutes)
app.use('/api/countries', countriesRoutes)
app.use('/api/approvednums', approvedRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/agents', agentsRoutes)
app.use('/api/whatsapp', wppIoRoutes)

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de sockets')
})

server.listen(app.get('port'), async () => {
  console.log(cl.bgBlue('Server iniciado en puerto: ' + app.get('port')))
  sequelize.sync({ force: false }).then(() => {
    console.log(cl.bgBlue('DB SYNC TRUE/FALSE = resetear datos cada que inicia el api'))
  }).catch(error => {
    console.log(cl.bgRed('se ha producido un error ', error.message))
  })
})

export default app
