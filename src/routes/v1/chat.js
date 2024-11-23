import express from 'express'
import {
  validateBody,
  validateParam,
} from '@/app/Http/Middleware/ValidateRouteMiddleware'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import IdValidator from '@/app/Http/Validators/param/IdValidator'
import ChatController from '@/app/Http/Controllers/ChatController'
import CreateGroupChatValidator from '@/app/Http/Validators/body/chats/CreateGroupChatValidator'
import AddGroupChatValidator from '@/app/Http/Validators/body/chats/AddGroupChatValidator'
import RemoveGroupChatValidator from '@/app/Http/Validators/body/chats/RemoveGroupChatValidator'
import MessageController from '@/app/Http/Controllers/MessageController'

// lấy ra bộ định tuyến
const chatRouter = express.Router()

chatRouter.get('/', validateUser, ChatController.allChat)

chatRouter.get(
  '/:id',
  validateUser,
  validateParam(IdValidator, 'id'),
  ChatController.getChat
)

chatRouter.get(
  '/:chatId/messages',
  validateUser,
  validateParam(IdValidator, 'chatId'),
  MessageController.allMessages
)

chatRouter.post(
  '/groups',
  validateUser,
  validateBody(CreateGroupChatValidator),
  ChatController.createGroupChat
)

chatRouter.put(
  '/groups/:chatId/add',
  validateUser,
  validateParam(IdValidator, 'chatId'),
  validateBody(AddGroupChatValidator),
  ChatController.addToGroup
)

chatRouter.put(
  '/groups/:chatId/remove',
  validateUser,
  validateParam(IdValidator, 'chatId'),
  validateBody(RemoveGroupChatValidator),
  ChatController.removeFromGroup
)
export default chatRouter
