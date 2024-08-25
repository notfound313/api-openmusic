const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { playlistService, service }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(playlistService, service);
    server.route(routes(playlistActivitiesHandler));
  },
};
