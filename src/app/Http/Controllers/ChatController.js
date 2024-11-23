import Chat from '@/app/Models/Chat'
import Emoji from '@/app/Models/Emoji'
import User from '@/app/Models/User'
import ChatEvent from '@/events/Chat.event'
import EmitSocketEvent from '@/events/EmitSocket.event'

export const createChatIfNotExist = async (users) => {
  const chat = await Chat.findOne({
    users: {
      $all: users,
    },
    isGroup: false,
  })

  if (chat) {
    return
  }

  await Chat.create({
    users: users,
  })
}

const allChat = async (req, res, next) => {
  try {
    const auth = req.user
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: auth._id } },
    })
      .populate('users', '-password -code')
      .populate('groupAdmin', '-password -code')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })

    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: '-password -code',
    })

    chats = await Emoji.populate(chats, {
      path: 'latestMessage.emoji',
    })

    return res.status(200).json(chats)
  } catch (error) {
    next(error)
  }
}

const getChat = async (req, res, next) => {
  try {
    const id = req.params.id
    const auth = req.user
    let chat = await Chat.findOne({
      users: { $elemMatch: { $eq: auth._id } },
      _id: id,
    })
      .populate('users', '-password -code')
      .populate('groupAdmin', '-password -code')

    if (!chat) {
      return res.status(404).json({
        message: 'not found',
      })
    }

    return res.json(chat)
  } catch (error) {
    next(error)
  }
}

const createGroupChat = async (req, res, next) => {
  try {
    const auth = req.user

    const { users, name } = req.body

    if (users.length < 2) {
      return res.status(400).json({
        message: 'cần tối thiểu 2 người để tạo nhóm',
      })
    }

    const userReceives = [...users]
    users.push(auth._id)

    const groupChat = await Chat.create({
      name: name,
      users: users,
      isGroup: true,
      groupAdmin: auth._id,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password -code')
      .populate('groupAdmin', '-password -code')

    // bắn sự kiện đến user trong group
    EmitSocketEvent.emit(userReceives, ChatEvent.CREATE_GROUP, fullGroupChat)

    res.status(200).json(fullGroupChat)
  } catch (error) {
    next(error)
  }
}

const removeFromGroup = async (req, res, next) => {
  try {
    const chatId = req.params.chatId
    const { userId } = req.body
    const auth = req.user

    const whereAuth =
      auth._id.toString() === userId ? {} : { groupAdmin: auth._id }

    const removed = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        ...whereAuth,
      },
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password -code')
      .populate('groupAdmin', '-password -code')

    if (!removed) {
      return res.status(404).json({
        message: 'not found',
      })
    }

    const userRemove = await User.findById(userId).select('-code -password')

    if (auth._id.toString() === userId) {
      // bắn sự kiện đến user trong group
      EmitSocketEvent.emit(
        removed.users.map((user) => user._id.toString()),
        ChatEvent.OUT_FROM_GROUP,
        removed,
        userRemove
      )
    } else {
      EmitSocketEvent.emit(
        removed.users
          .filter((user) => !user._id.equals(auth._id))
          .map((user) => user._id.toString()),
        ChatEvent.REMOVE_FROM_GROUP,
        removed,
        userRemove
      )
      EmitSocketEvent.emit(
        userId,
        ChatEvent.REMOVE_FROM_GROUP,
        removed,
        userRemove
      )
    }

    return res.json(removed)
  } catch (error) {
    next(error)
  }
}

const addToGroup = async (req, res, next) => {
  try {
    const chatId = req.params.chatId
    const { userId } = req.body
    const auth = req.user

    const added = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: auth._id,
      },
      {
        $addToSet: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password -code')
      .populate('groupAdmin', '-password -code')

    if (!added) {
      return res.status(404).json({
        message: 'not found',
      })
    }

    const userAdd = await User.findById(userId).select('-code -password')

    EmitSocketEvent.emit(
      added.users
        .filter((user) => !user._id.equals(auth._id))
        .map((user) => user._id.toString()),
      ChatEvent.ADD_TO_GROUP,
      added,
      userAdd
    )

    return res.json(added)
  } catch (error) {
    next(error)
  }
}

export default {
  allChat,
  getChat,
  createGroupChat,
  removeFromGroup,
  addToGroup,
}
