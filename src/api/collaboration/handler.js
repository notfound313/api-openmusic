const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(collaborationService, playlistService, userService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._userService.validateUserId(userId);

    const collaborationId = await this._collaborationService.addCollaborator(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._userService.validateUserId(userId);
    await this._collaborationService.deleteCollaborator(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}
module.exports = CollaborationHandler;
