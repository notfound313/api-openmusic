require('dotenv').config();
const Hapi = require('@hapi/hapi');

// album
const AlbumValidator = require('./validator/album');
const albums = require('./api/album');
const { AlbumService } = require('./services/postgres/AlbumService');

// song
const SongValidator = require('./validator/song');
const songs = require('./api/song');
const { SongsService } = require('./services/postgres/SongsService');

// user
const UserValidator = require('./validator/user');
const users = require('./api/user');
const UserService = require('./services/postgres/UsersService');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongsService();
  const userService = new UserService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([{
    plugin: albums,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  },
  {
    plugin: songs,
    options: {
      service: songService,
      validator: SongValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: userService,
      validator: UserValidator,
    },
  },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
