import mongoose from 'mongoose'
import UserGenderEnum from '../Enums/Users/UserGenderEnum'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    birthdate: Date,
    password: String,
    gender: {
      type: Number,
      enum: Object.keys(UserGenderEnum.allName()).map((k) => Number(k)),
      default: UserGenderEnum.SECRET,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      url: String,
      publicId: String,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)
