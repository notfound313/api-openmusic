const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumService) {
    this._service = service;
    this._albumService = albumService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.verifyAlbum(albumId);
    await this._service.verifyAlbumLike(albumId, credentialId);
    await this._service.addAlbumLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.verifyAlbum(albumId);
    await this._service.deleteAlbumLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil membatalkan like pada album',
    });
    response.code(200);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumService.verifyAlbum(albumId);
    const { likes, cached } = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);

    if (cached) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumLikesHandler;
