import mongoose from 'mongoose'
import FriendStatusEnum from '../Enums/Friend/FriendStatusEnum'

const friendSchema = new mongoose.Schema(
  {
    userFromId: {
      type: 'ObjectId',
      ref: 'User',
    },
    userToId: {
      type: 'ObjectId',
      ref: 'User',
    },
    status: {
      type: Number,
      enum: Object.keys(FriendStatusEnum.allName()).map((k) => Number(k)),
      default: FriendStatusEnum.REQUEST,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Friend', friendSchema)
