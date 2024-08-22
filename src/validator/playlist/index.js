const InvariantError = require("../../exceptions/InvariantError");
const PlaylistPayloadSchema = require("./schema")

const PlaylistValidator = {
    validatePlaylistSchema : (payload) => {
        const validateResult = PlaylistPayloadSchema.validate(payload);
        if(validateResult.error){
            throw new InvariantError(validateResult.error.message);
        }
    }
}

module.exports = PlaylistPayloadSchema;