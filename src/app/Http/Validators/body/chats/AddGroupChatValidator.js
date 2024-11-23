import Joi from 'joi'

const AddGroupChatValidator = Joi.object({
  userId: Joi.string().required(),
})

export default AddGroupChatValidator
