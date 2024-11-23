import MessageTypeEnum from '@/app/Enums/Message/MessageTypeEnum'
import Joi from 'joi'

const SendMessageValidator = Joi.object({
  content: Joi.alternatives()
    .try(
      Joi.object({
        url: Joi.string(),
        publicId: Joi.string(),
      }),
      Joi.string()
    )
    .required(),
  chatId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: Joi.number()
    .integer()
    .valid(...Object.keys(MessageTypeEnum.allName()).map((k) => Number(k))),
})

export default SendMessageValidator
