import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  users: [
    {
      type: 'ObjectId',
      ref: 'User',
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

export default mongoose.model('Chat', chatSchema)
