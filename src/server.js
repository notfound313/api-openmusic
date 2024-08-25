require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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
// authentications
const authentications = require('./api/authentication');
const AuthenticationsService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentication');
// playlist
const playlists = require('./api/playlist');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');
// playlistsong
const playlistsongs = require('./api/playlistsong');
const PlaylistSongService = require('./services/postgres/PlaylistSongService');
const PlaylistSongValidator = require('./validator/playlistsong');
// collaboration
const collaborations = require('./api/collaboration');
const CollaborationsService = require('./services/postgres/CollaborationService');
const CollaborationValidator = require('./validator/collaboration');
// activities
const activities = require('./api/activities');
const ActivitiesService = require('./services/postgres/PlaylistActivitiesService');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const collaborationService = new CollaborationsService();
  const albumService = new AlbumService();
  const songService = new SongsService();
  const userService = new UserService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistService();
  const playlistActivityService = new ActivitiesService();
  const playlistSongService = new PlaylistSongService(collaborationService, playlistService);
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
  {
    plugin: playlistsongs,
    options: {
      service: playlistSongService,
      validator: PlaylistSongValidator,
      activities: playlistActivityService,
    },
  },

  {
    plugin: playlists,
    options: {
      service: playlistService,
      validator: PlaylistValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      userService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      collaborationService,
      playlistService,
      userService,
      validator: CollaborationValidator,
    },
  },
  {
    plugin: activities,
    options: {
      playlistService: playlistSongService,
      service: playlistActivityService,
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
