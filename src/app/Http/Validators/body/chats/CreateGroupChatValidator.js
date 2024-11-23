import Joi from 'joi'

const CreateGroupChatValidator = Joi.object({
  users: Joi.array().items(Joi.string().required()),
  name: Joi.string().required(),
})

export default CreateGroupChatValidator
