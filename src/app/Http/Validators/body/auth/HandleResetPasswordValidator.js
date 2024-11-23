const Joi = require('joi')

const HandleResetPasswordValidator = Joi.object({
  password: Joi.string().required().min(6),
  code: Joi.string().required(),
  email: Joi.string().email().required(),
})

export default HandleResetPasswordValidator
