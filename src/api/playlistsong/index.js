const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, { service, validator, activities }) => {
    const playlistSongHandler = new PlaylistSongHandler(
      service,
      validator,
      activities,
    );
    server.route(routes(playlistSongHandler));
  },

};
