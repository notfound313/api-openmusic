const autoBind = require("auto-bind");

class MusicHandler {
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
      status: "success",
      message: "album berhasil ditambahkan",
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
      status: "success",
      message: "berhasil mendapatkan album",
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
      status: "success",
      message: "berhasil mendapatkan album",
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
      status: "success",
      message: "album berhasil diubah",
    });
    response.code(200);
    return response;
  }
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: "success",
      message: "album berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  //song handler

  async postSongHandler(request, h) {
    
    this._validator.validateSongPayload(request.payload);
    
    const { title,year,performer,genre ,duration, albumId } = request.payload;
    const songId = await this._service.addSong({ title,year, genre,performer,duration, albumId });
    const response = h.response({
      status: "success",
      message: "song berhasil ditambahkan",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  //get all song
  async getSongsHandler(request, h) {
    const { title, performer } = request.query;

    const songs = await this._service.getSongs({ title, performer });
    const response = h.response({
      status: "success",
      message: "berhasil mendapatkan song",
      data: {
        songs,
      },
    });
    return response;
  }

  //get song by id
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: "success",
      message: "berhasil mendapatkan song",
      data: {
        song,
      },
    });
    return response;
  }

  //put song by id
  async putSongByIdHandler(request, h) {
    const { id } = request.params;
    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(id,request.payload);
    const response = h.response({
      status: "success",
      message: "song berhasil diubah",
    });
    response.code(200);
    return response;
  }

  //delete song by id
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: "success",
      message: "song berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  //getsongandalbum
  async getSongAlbumByIdHandler(request, h) {
        const { id } = request.params;
        const song = await this._service.getSongAlbumById(id);
        const response = h.response({
            status: "success",
            message: "berhasil mendapatkan song",
            data: {
                song,
            },
        });
        return response;
    }
}

module.exports = MusicHandler;
