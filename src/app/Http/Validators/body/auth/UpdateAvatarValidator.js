import Joi from 'joi'

const UpdateAvatarValidator = Joi.object({
  avatar: Joi.object({
    publicId: Joi.string(),
    url: Joi.string(),
  }).required(),
})

export default UpdateAvatarValidator
