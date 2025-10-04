import LoginSession from '@/app/Models/LoginSession'

const getLoginHistory = async (req, res, next) => {
  try {
    const userId = req.user._id
    const loginHistory = await LoginSession.find({ userId }).sort({
      loginTime: -1,
    })
    return res.status(200).json(loginHistory)
  } catch (error) {
    next(error)
  }
}

export default {
  getLoginHistory,
}
