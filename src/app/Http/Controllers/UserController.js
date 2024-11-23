import Friend from '@/app/Models/Friend'
import User from '@/app/Models/User'

const allUsers = async (req, res, next) => {
  try {
    const key = req.query.key
    const auth = req.user

    const whereKey = {}
    if (key && key.trim() !== '') {
      whereKey['$or'] = [{ fullName: { $regex: `.*${key}.*`, $options: 'i' } }]
    }

    // Lấy thông tin người dùng
    const users = await User.find({
      ...whereKey,
      _id: { $ne: auth._id },
    }).lean()

    // Lấy tất cả bạn bè liên quan đến những người dùng này
    const userIDs = users.map((user) => user._id)
    const friends = await Friend.find({
      $or: [
        { userFromId: { $in: userIDs }, userToId: auth._id },
        { userFromId: auth._id, userToId: { $in: userIDs } },
      ],
    }).lean()

    // Ánh xạ thông tin bạn bè vào người dùng tương ứng
    const usersWithFriend = users.map((user) => {
      const friend = friends.find(
        (f) => f.userToId.equals(user._id) || f.userFromId.equals(user._id)
      )
      return { ...user, friend }
    })

    return res.json(usersWithFriend)
  } catch (error) {
    next(error)
  }
}

export default {
  allUsers,
}
