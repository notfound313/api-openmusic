const routes = (handler)=>[
  {
    path: '/export/playlists/{playlistId}',
    method: 'POST',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];
