import UserGenderEnum from '@/app/Enums/Users/UserGenderEnum'

const Joi = require('joi')

const RegisterValidator = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  birthdate: Joi.date().max('now').required(),
  gender: Joi.number()
    .integer()
    .valid(...Object.keys(UserGenderEnum.allName()).map((k) => Number(k))),
})

export default RegisterValidator
