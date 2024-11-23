import express from 'express'
import {
  validateBody,
  validateParam,
} from '@/app/Http/Middleware/ValidateRouteMiddleware'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import MessageController from '@/app/Http/Controllers/MessageController'
import SendMessageValidator from '@/app/Http/Validators/body/messages/SendMessageValidator'
import IdValidator from '@/app/Http/Validators/param/IdValidator'

// lấy ra bộ định tuyến
const messageRouter = express.Router()

messageRouter.post(
  '/',
  validateUser,
  validateBody(SendMessageValidator),
  MessageController.sendMessage
)

messageRouter.delete(
  '/:id',
  validateUser,
  validateParam(IdValidator, 'id'),
  MessageController.destroyMessage
)

export default messageRouter
