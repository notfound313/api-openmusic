const autoBind = require('auto-bind');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });
    const response = h.response({
      status: 'success',
      message: 'user berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersByUsernameHandler(request, h) {
    const { username = '' } = request.query;
    const users = await this._service.getUsersByUsername(username);
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan user',
      data: {
        users,
      },
    });
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan user',
      data: {
        user,
      },
    });
    return response;
  }

  async putUserByIdHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { id } = request.params;
    await this._service.editUserById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'berhasil mengubah user',
    });
    return response;
  }

  async deleteUserByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteUserById(id);
    const response = h.response({
      status: 'success',
      message: 'berhasil menghapus user',
    });
    return response;
  }
}
module.exports = UserHandler;
