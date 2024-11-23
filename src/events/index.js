import { Server } from 'socket.io'
import EmitSocketEvent from './EmitSocket.event'

const initSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    // thực hiện join vào một room cụ thể của user(mặc định)
    socket.on('join', (room) => {
      console.log(`join room: "${room}", ${typeof room}`)
      socket.join(room) // phải có cái này (không được xóa nó)
    })

    socket.on('typing', (rooms, user) => {
      socket.to(rooms).emit('typing', user)
    })
  })

  // bắn sự kiện đến một user nào đó từ server
  EmitSocketEvent.on((rooms, event, ...args) => {
    console.log(`event to room: "${rooms}", ${typeof rooms}, event: "${event}"`)
    io.to(rooms).emit(event, ...args)
  })
}

export default initSocket
