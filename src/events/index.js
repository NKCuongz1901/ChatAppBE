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

    //====== Video call signal =======
    socket.on('call:user', ({ callerId, calleeId }) => {
      socket.to(calleeId).emit('call:incoming', { callerId })
    })

    socket.on('webrtc:offer', ({ fromUserId, toUserId, sdp }) => {
      socket.to(toUserId).emit('webrtc:offer', { fromUserId, sdp })
    })

    socket.on('webrtc:answer', ({ fromUserId, toUserId, sdp }) => {
      socket.to(toUserId).emit('webrtc:answer', { fromUserId, sdp })
    })

    socket.on('webrtc:ice-candidate', ({ fromUserId, toUserId, candidate }) => {
      socket
        .to(toUserId)
        .emit('webrtc:ice-candidate', { fromUserId, candidate })
    })

    socket.on('call:end', ({ fromUserId, toUserId }) => {
      socket.to(toUserId).emit('call:ended', { fromUserId })
    })
  })

  // bắn sự kiện đến một user nào đó từ server
  EmitSocketEvent.on((rooms, event, ...args) => {
    console.log(`event to room: "${rooms}", ${typeof rooms}, event: "${event}"`)
    io.to(rooms).emit(event, ...args)
  })
}

export default initSocket
