const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'song berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  // get all song
  async getSongsHandler(request, h) {
    const { title, performer } = request.query;

    const songs = await this._service.getSongs({ title, performer });
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan song',
      data: {
        songs,
      },
    });
    return response;
  }

  // get song by id
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan song',
      data: {
        song,
      },
    });
    return response;
  }

  // put song by id
  async putSongByIdHandler(request, h) {
    const { id } = request.params;
    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'song berhasil diubah',
    });
    response.code(200);
    return response;
  }

  // delete song by id
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'song berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // getsongandalbum
  async getSongAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan song',
      data: {
        song,
      },
    });
    return response;
  }
}

module.exports = SongHandler;
