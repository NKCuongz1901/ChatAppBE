import User from '@/app/Models/User'
import {
  generateCode,
  getUserResult,
  sendResetPasswordMail,
} from '@/app/utils/helper'
import { comparePass, hashPass } from '@/config/Bcrypt'
import { createToken } from '@/config/JsonWebToken'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

const enableTwoFA = async (req, res, next) => {
  try {
    const user = req.user
    const secretCode = authenticator.generateSecret()
    const serviceName = 'ChatApp'
    user.twoFASecretCode = secretCode
    await user.save()
    const optAuthUrl = authenticator.keyuri(user.email, serviceName, secretCode)
    const qrDataUrl = await QRCode.toDataURL(optAuthUrl)
    return res.json({ qrcode: qrDataUrl, optAuthUrl, secretCode })
  } catch (error) {
    next(error)
  }
}

const verifyTwoFACode = async (req, res, next) => {
  try {
    const user = req.user
    const { code } = req.body

    if (!user.twoFASecretCode) {
      return res.status(401).json({ message: '2FA chưa được kích hoạt' })
    }

    const valid = authenticator.verify({
      token: code,
      secret: user.twoFASecretCode,
    })
    if (!valid) {
      return res.status(401).json({ message: 'Mã 2FA không hợp lệ' })
    }
    user.twoFARecoveryCode = user.twoFASecretCode
    user.twoFAEnable = true
    user.twoFASecretCode = null
    await user.save()
    return res.json({ message: '2FA đã được kích hoạt thành công' })
  } catch (error) {
    next(error)
  }
}

const disableTwoFA = async (req, res, next) => {
  try {
    const user = req.user
    user.twoFAEnable = false
    user.twoFASecretCode = null
    user.twoFARecoveryCode = null
    await user.save()
    return res.json({ message: '2FA đã được vô hiệu hóa thành công' })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password, code } = req.body

    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(401).json({ message: 'tài khoản không tồn tại' })
    }

    const checkPassword = comparePass(password, user.password)
    if (!checkPassword) {
      return res.status(401).json({ message: 'sai mật khẩu' })
    }

    if (user.twoFAEnable) {
      if (!code) {
        return res.status(401).json({ message: 'Vui lòng nhập mã 2FA' })
      }
      const valid = authenticator.verify({
        token: code,
        secret: user.twoFARecoveryCode,
      })
      if (!valid) {
        return res.status(401).json({ message: 'Mã 2FA không hợp lệ' })
      }
    }

    const token = createToken(user.toObject())

    const userResult = getUserResult(user)

    return res.status(200).json({ user: userResult, token })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const body = req.body
    const userExist = await User.findOne({ email: body.email })

    if (userExist) {
      return res.status(409).json({
        message: 'email đã tồn tại',
      })
    }

    body.password = hashPass(body.password)

    const user = await User.create(body)

    const token = createToken(user.toObject())

    const userResult = getUserResult(user)

    return res.status(201).json({ user: userResult, token })
  } catch (error) {
    next(error)
  }
}

const requestResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(401).json({ message: 'tài khoản không tồn tại' })
    }

    const code = generateCode()
    user.code = code
    await user.save()

    sendResetPasswordMail(user, code)

    return res.json({
      message: 'Kiểm tra email để lấy lại mật khẩu',
    })
  } catch (error) {
    next(error)
  }
}

const handleResetPassword = async (req, res, next) => {
  try {
    const { password, code, email } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(401).json({ message: 'tài khoản không tồn tại' })
    }

    if (user.code !== code) {
      return res.status(401).json({ message: 'sai mã bảo mật' })
    }

    // hash mật khẩu cho user sau đó lưu vào database
    user.password = hashPass(password)
    user.code = null
    await user.save()

    return res.json({
      message: 'Đổi mật khẩu thành công',
    })
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const auth = req.user
    const { avatar } = req.body

    auth.avatar = avatar
    await auth.save()

    return res.json({
      message: 'Đổi ảnh đại diện thành công',
    })
  } catch (error) {
    next(error)
  }
}

export default {
  login,
  register,
  requestResetPassword,
  handleResetPassword,
  updateAvatar,
  enableTwoFA,
  verifyTwoFACode,
  disableTwoFA,
}
