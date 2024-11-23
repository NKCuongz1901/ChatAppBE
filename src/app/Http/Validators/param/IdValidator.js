const Joi = require('joi')

const IdValidator = Joi.object({
  param: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
})

module.exports = IdValidator
