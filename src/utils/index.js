const mapDBtoAlbum = ({
  album_id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id: album_id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBtoSong = ({
  song_id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id: song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,

});

const mapDBPlaylist = ({
  id,
  name,
  user_id,
}) => ({
  id,
  name,
  username: user_id,
});

module.exports = { mapDBtoAlbum, mapDBtoSong, mapDBPlaylist };
