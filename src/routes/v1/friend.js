import express from 'express'
import { validateParam } from '@/app/Http/Middleware/ValidateRouteMiddleware'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import IdValidator from '@/app/Http/Validators/param/IdValidator'
import FriendController from '@/app/Http/Controllers/FriendController'

// lấy ra bộ định tuyến
const friendRouter = express.Router()

friendRouter.post(
  '/add/:userId',
  validateUser,
  validateParam(IdValidator, 'userId'),
  FriendController.addFriend
)

friendRouter.post(
  '/accept/:userId',
  validateUser,
  validateParam(IdValidator, 'userId'),
  FriendController.acceptFriend
)

friendRouter.get('/requests', validateUser, FriendController.friendRequests)
friendRouter.get('/', validateUser, FriendController.allFriend)

export default friendRouter
