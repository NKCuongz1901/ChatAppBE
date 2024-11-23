import MessageTypeEnum from '@/app/Enums/Message/MessageTypeEnum'
import Chat from '@/app/Models/Chat'
import Message from '@/app/Models/Message'
import EmitSocketEvent from '@/events/EmitSocket.event'
import MessageEvent from '@/events/Message.event'

const allMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', '-password -code')
      .populate('emoji')

    res.json(messages)
  } catch (error) {
    next(error)
  }
}

const sendMessage = async (req, res, next) => {
  const { content, chatId, type } = req.body

  const newMessage = {
    sender: req.user._id,
    chat: chatId,
    type: type,
  }

  switch (type) {
    case MessageTypeEnum.IMAGE:
      newMessage.image = content
      break
    case MessageTypeEnum.FILE:
      newMessage.file = content
      break
    case MessageTypeEnum.EMOJI:
      newMessage.emoji = content
      break
    default:
      newMessage.text = content
      break
  }

  try {
    const message = await Message.create(newMessage)

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message })

    // Gộp các lệnh populate vào một lệnh
    const messageFull = await Message.findById(message._id)
      .populate('sender', '-password -code')
      .populate('chat')
      .populate('emoji')

    // bắn sự kiện đến những thành viên trong đoạn chat
    EmitSocketEvent.emit(
      messageFull.chat?.users?.map((userId) => userId?.toString()),
      MessageEvent.NEW,
      messageFull
    )

    res.json(messageFull)
  } catch (error) {
    next(error)
  }
}

const destroyMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id

    const message = await Message.findById(messageId).populate('chat')

    if (!message) {
      return res.status(404).json({
        message: 'not found',
      })
    }

    await Message.deleteOne({
      _id: message._id,
    })

    if (message._id.equals(message.chat?.latestMessage)) {
      const messages = await Message.find({
        chat: message.chat,
      }).sort({ createdAt: -1 })

      await Chat.findByIdAndUpdate(message.chat._id, {
        latestMessage: messages[0],
      })
    }

    // bắn sự kiện đến những thành viên trong đoạn chat
    EmitSocketEvent.emit(
      message.chat?.users?.map((userId) => userId?.toString()),
      MessageEvent.DELETE,
      message
    )

    res.json({
      message: 'Đã xóa tin nhắn khỏi đoạn chat',
    })
  } catch (error) {
    next(error)
  }
}

export default {
  allMessages,
  sendMessage,
  destroyMessage,
}
