const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumlikes',
  version: '1.0.0',
  register: async (server, { service, albumService }) => {
    const albumLikeService = new AlbumLikesHandler(service, albumService);
    server.route(routes(albumLikeService));
  },
};
