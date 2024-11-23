const Joi = require('joi')

const RequestResetPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
})

module.exports = RequestResetPasswordValidator
