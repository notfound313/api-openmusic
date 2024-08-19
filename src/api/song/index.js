const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'song',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const musicHandler = new SongHandler(service, validator);
    server.route(routes(musicHandler));
  },
};
