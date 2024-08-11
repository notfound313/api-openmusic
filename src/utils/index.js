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
    id : song_id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId : album_id,
    createdAt : created_at,
    updatedAt : updated_at,

});

module.exports = { mapDBtoAlbum, mapDBtoSong}