import EmojiController from '@/app/Http/Controllers/EmojiController'
import { validateBody } from '@/app/Http/Middleware/ValidateRouteMiddleware'
import CreateEmojiValidator from '@/app/Http/Validators/body/emojis/CreateEmojiValidator'
import express from 'express'

// lấy ra bộ định tuyến để định nghĩa các tuyến đường
const emojiRouter = express.Router()

emojiRouter.get('/', EmojiController.all)
emojiRouter.post(
  '/',
  validateBody(CreateEmojiValidator),
  EmojiController.create
)

export default emojiRouter
