const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      message: 'album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumHandler(request, h) {
    const albums = await this._service.getAlbums();
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan album',
      data: {
        albums,
      },
    });
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan album',
      data: {
        album,
      },
    });
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._validator.validateAlbumPayload(request.payload);
    await this._service.editAlbumById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'album berhasil diubah',
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // song handler
}

module.exports = AlbumHandler;
