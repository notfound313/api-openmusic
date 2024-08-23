const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistSchema(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(name, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan playlist',
      data: {
        playlistId,
      },

    });

    response.code(201);
    return response;
  }

  async getAllPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getAllPlaylist(credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    return response;
  }

  async getPlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._serviceservice.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._service.getPlaylistById(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylist(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });

    return response;
  }
}

module.exports = PlaylistHandler;
