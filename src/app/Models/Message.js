import mongoose from 'mongoose'
import MessageTypeEnum from '../Enums/Message/MessageTypeEnum'

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: 'ObjectId',
      ref: 'Chat',
    },
    text: {
      type: String,
    },
    sender: {
      type: 'ObjectId',
      ref: 'User',
    },
    emoji: {
      type: 'ObjectId',
      ref: 'Emoji',
    },
    file: {
      url: String,
      publicId: String,
    },
    image: {
      url: String,
      publicId: String,
    },
    type: {
      type: Number,
      enum: Object.keys(MessageTypeEnum.allName()).map((k) => Number(k)),
      default: MessageTypeEnum.TEXT,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Message', messageSchema)
