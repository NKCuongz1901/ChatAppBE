import FriendStatusEnum from '@/app/Enums/Friend/FriendStatusEnum'
import Friend from '@/app/Models/Friend'
import { createChatIfNotExist } from './ChatController'
import EmitSocketEvent from '@/events/EmitSocket.event'
import FriendEvent from '@/events/Friend.event'

const allFriend = async (req, res, next) => {
  try {
    const auth = req.user

    const friends = await Friend.find({
      $or: [{ userFromId: auth._id }, { userToId: auth._id }],
      status: FriendStatusEnum.CONNECT,
    }).populate([
      {
        path: 'userFromId',
        select: '-password -code',
      },
      {
        path: 'userToId',
        select: '-password -code',
      },
    ])

    return res.json(friends)
  } catch (error) {
    next(error)
  }
}

const friendRequests = async (req, res, next) => {
  try {
    const auth = req.user

    const friends = await Friend.find({
      userToId: auth._id,
      status: FriendStatusEnum.REQUEST,
    }).populate([
      {
        path: 'userFromId',
        select: '-password -code',
      },
    ])

    console.log(friends, auth)

    return res.json(friends)
  } catch (error) {
    next(error)
  }
}

const addFriend = async (req, res, next) => {
  try {
    const auth = req.user
    const userId = req.params.userId

    const friendDb = await Friend.findOne({
      $or: [
        { userFromId: auth._id, userToId: userId },
        { userFromId: userId, userToId: auth._id },
      ],
    })

    if (friendDb) {
      if (friendDb.status == FriendStatusEnum.CONNECT) {
        return res.status(400).json({
          message: 'Bạn đã kết bạn với người này rồi',
        })
      }

      return res.status(400).json({
        message: 'Bạn đã gửi lời mời kết bạn cho người này rồi',
      })
    }

    const created = await Friend.create({
      userFromId: auth._id,
      userToId: userId,
      status: FriendStatusEnum.REQUEST,
    })

    const friend = await Friend.findById(created._id).populate(
      'userFromId',
      '-password -code'
    )

    // bắn sự kiện đến user được yêu cầu
    EmitSocketEvent.emit(userId, FriendEvent.ADD, friend)

    return res.json({ message: 'Đã gửi lời mời kết bạn' })
  } catch (error) {
    next(error)
  }
}

const acceptFriend = async (req, res, next) => {
  try {
    const auth = req.user
    const userId = req.params.userId

    const friendDb = await Friend.findOne({
      userFromId: userId,
      userToId: auth._id,
    }).populate('userToId', '-password -code')

    if (!friendDb) {
      return res.status(400).json({
        message: 'Không có lời mời kết bạn nào từ người này',
      })
    }

    if (friendDb.status !== FriendStatusEnum.REQUEST) {
      return res.status(400).json({
        message: 'Không có lời mời kết bạn nào từ người này',
      })
    }

    friendDb.status = FriendStatusEnum.CONNECT
    await friendDb.save()

    createChatIfNotExist([userId, auth._id])

    // bắn sự kiện đến user được chấp nhận
    EmitSocketEvent.emit(userId, FriendEvent.ACCEPT, friendDb)

    return res.json({ message: 'Đã chấp nhận lời mời kết bạn' })
  } catch (error) {
    next(error)
  }
}

export default {
  allFriend,
  addFriend,
  acceptFriend,
  friendRequests,
}
