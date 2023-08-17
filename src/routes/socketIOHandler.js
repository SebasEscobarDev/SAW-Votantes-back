import cl from 'picocolors'

export async function configureSocketIO (io) {
  io.on('connection', (socket) => {
    console.log(cl.bgGreen(`⚡: ${socket.id} usuario conectado!`))

    socket.on('qrcode', async (qrcode) => {
      io.emit('qrcodeResponse', qrcode)
    })

    socket.on('logout', async () => {
      console.log(cl.bgRed('🔥: A user disconnected'))
    })
  })
}
