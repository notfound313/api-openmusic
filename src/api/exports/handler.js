
class ExportsHandler {
  constructor(playlistsService, exportsService, validator) {
    this._playlistsService = playlistsService;
    this._exportsService = exportsService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {    
      this._validator.validateExportPlaylistPayload(request.payload);
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this._exportsService.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    
  }
}
