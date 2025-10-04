import express from 'express'
import { validateBody } from '@/app/Http/Middleware/ValidateRouteMiddleware'
import AuthController from '@/app/Http/Controllers/AuthController'
import RequestResetPasswordValidator from '@/app/Http/Validators/body/auth/RequestResetPasswordValidator'
import HandleResetPasswordValidator from '@/app/Http/Validators/body/auth/HandleResetPasswordValidator'
import RegisterValidator from '@/app/Http/Validators/body/auth/RegisterValidator'
import LoginValidator from '@/app/Http/Validators/body/auth/LoginValidator'
import UpdateAvatarValidator from '@/app/Http/Validators/body/auth/UpdateAvatarValidator'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import { extractDeviceInfo } from '@/app/Http/Middleware/ExtractDeviceInfo'

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

router.post(
  '/login',
  validateBody(LoginValidator),
  extractDeviceInfo,
  AuthController.login
)

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

router.post('/enable-two-fa', validateUser, AuthController.enableTwoFA)
router.post('/verify-two-fa', validateUser, AuthController.verifyTwoFACode)
router.post('/disable-two-fa', validateUser, AuthController.disableTwoFA)

export default router
