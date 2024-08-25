const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistService, service) {
    this._playlistService = playlistService;
    this._service = service;
    autoBind(this);
  }

  async getActivitiesByPlaylistIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getActivitiesByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
