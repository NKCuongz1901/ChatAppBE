import express from 'express'
import authRouter from './auth'
import friendRouter from './friend'
import chatRouter from './chat'
import messageRouter from './message'
import uploadRouter from './upload'
import UserController from '@/app/Http/Controllers/UserController'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import emojiRouter from './emoji'
import loginSessionRouter from './LoginSession'
// lấy ra bộ định tuyến
const router = express.Router()

router.use('/auth', authRouter)
router.use('/login-sessions', loginSessionRouter)
router.use('/friends', friendRouter)
router.use('/chats', chatRouter)
router.use('/messages', messageRouter)
router.use('/uploads', uploadRouter)
router.use('/emojis', emojiRouter)
router.get('/users', validateUser, UserController.allUsers)

export default router
