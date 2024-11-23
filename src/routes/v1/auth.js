import express from 'express'
import { validateBody } from '@/app/Http/Middleware/ValidateRouteMiddleware'
import AuthController from '@/app/Http/Controllers/AuthController'
import RequestResetPasswordValidator from '@/app/Http/Validators/body/auth/RequestResetPasswordValidator'
import HandleResetPasswordValidator from '@/app/Http/Validators/body/auth/HandleResetPasswordValidator'
import RegisterValidator from '@/app/Http/Validators/body/auth/RegisterValidator'
import LoginValidator from '@/app/Http/Validators/body/auth/LoginValidator'
import UpdateAvatarValidator from '@/app/Http/Validators/body/auth/UpdateAvatarValidator'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'

// lấy ra bộ định tuyến
const router = express.Router()

router.post(
  '/request-reset-password',
  validateBody(RequestResetPasswordValidator),
  AuthController.requestResetPassword
)

router.post(
  '/handle-reset-password',
  validateBody(HandleResetPasswordValidator),
  AuthController.handleResetPassword
)

router.post('/login', validateBody(LoginValidator), AuthController.login)

router.post(
  '/register',
  validateBody(RegisterValidator),
  AuthController.register
)

router.put(
  '/update-avatar',
  validateUser,
  validateBody(UpdateAvatarValidator),
  AuthController.updateAvatar
)

export default router
