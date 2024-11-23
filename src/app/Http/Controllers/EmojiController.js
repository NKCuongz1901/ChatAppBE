import Emoji from '@/app/Models/Emoji'

const all = async (req, res, next) => {
  try {
    const emojis = await Emoji.find()

    return res.json(emojis)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const emoji = await Emoji.create(req.body)

    return res.status(201).json(emoji)
  } catch (error) {
    next(error)
  }
}

export default {
  all,
  create,
}
