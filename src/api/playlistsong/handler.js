const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistSongOwner(playlistId,credentialId)
    const playlistSongId = await this._service.addSongToPlaylist(playlistId, songId);
   
    const response = h.response({
        status: 'success',
        message: 'Song berhasil ditambahkan ke playlist',
        data: {
            playlistSongId,
        },
      });
    response.code(201);   
   
   
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id:playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistSongOwner(playlistId,credentialId)
    const  data  = await this._service.getSongsFromPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      data,
    });
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const {id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistSongOwner(playlistId,credentialId)
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    return response;
  }
}
module.exports = PlaylistSongHandler;
