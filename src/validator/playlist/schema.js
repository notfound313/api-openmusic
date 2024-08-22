const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
    songId : Joi.string().required(),
    userId : Joi.string().required(),
})

module.exports = PlaylistPayloadSchema;