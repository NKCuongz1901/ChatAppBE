import mongoose from 'mongoose'

const emojiSchema = new mongoose.Schema({
  name: {
    type: String,
    require,
  },
  src: {
    url: String,
    publicId: String,
  },
})

export default mongoose.model('Emoji', emojiSchema)
