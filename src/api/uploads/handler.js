const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
  constructor(service, validator, albumService) {
    this._service = service;
    this._validator = validator;
    this._albumService = albumService;

    autoBind(this);
  }

  async postUploadCoversHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);

    const fileLocation = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;

    await this._albumService.addOrUpdateCover(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
