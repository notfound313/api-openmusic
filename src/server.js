require("dotenv").config();
const Hapi = require("@hapi/hapi");
const MusicValidator = require("./validator/music");
const musics = require("./api/musics");
const { OpenMusicService } = require("./services/postgres/OpenMusicService");
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const musicService = new OpenMusicService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  await server.register({
    plugin: musics,
    options: {
      service: musicService,
      validator: MusicValidator,
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
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
