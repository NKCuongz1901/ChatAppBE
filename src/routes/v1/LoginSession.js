import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import express from 'express'
import LoginSessionController from '@/app/Http/Controllers/LoginSessionController'

const router = express.Router()

router.get('/', validateUser, LoginSessionController.getLoginHistory)

export default router
