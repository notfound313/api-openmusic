const routes = (handler) => [
  {
    path: '/export/playlists/{id}',
    method: 'POST',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];
module.exports = routes;
