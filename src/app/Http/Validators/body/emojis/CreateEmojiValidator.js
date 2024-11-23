import Joi from 'joi'

const CreateEmojiValidator = Joi.object({
  src: Joi.object({
    url: Joi.string(),
    publicId: Joi.string(),
  }).required(),
  name: Joi.string().required(),
})

export default CreateEmojiValidator
