import Joi from 'joi'

const RemoveGroupChatValidator = Joi.object({
  userId: Joi.string().required(),
})

export default RemoveGroupChatValidator
