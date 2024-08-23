const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBtoSong } = require('../../utils');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;
    
    await this.verifyPlaylistAndSong(playlistId, songId);
    const query = {
      text: 'INSERT INTO playlist_song VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
    

    return result.rows[0].id;
  }

  async verifyPlaylistAndSong(playlistId, songId) {
    const playlistQuery = {
      text: 'SELECT id FROM playlist WHERE id = $1',
      values: [playlistId],
    };
   

    const playlistResult = await this._pool.query(playlistQuery);
    

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songQuery = {
      text: 'SELECT song_id FROM song WHERE song_id = $1',
      values: [songId],
    };
    

    const songResult = await this._pool.query(songQuery);
    
    if (!songResult.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const querySong = {
    text: `SELECT song.song_id, song.title, song.performer
         FROM song
         INNER JOIN playlist_song ON playlist_song.song_id = song.song_id
         WHERE playlist_song.playlist_id = $1`,
      values: [playlistId],
    };   

    const resultSong = await this._pool.query(querySong);
    const query = {
    text: `SELECT playlist.id, playlist.name, users.username 
          FROM playlist
          INNER JOIN users ON playlist.user_id = users.id WHERE playlist.id = $1`,
    values: [playlistId],
    }  
    const resultPlaylist = await this._pool.query(query); 
    const playlist = resultPlaylist.rows[0]
    const songs = resultSong.rows.map(mapDBtoSong);

    return { 
      playlist:{
        ...playlist,
        songs, 
      }                  
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_song WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }

  async verifyPlaylistSongOwner(playlistId, userId) {
      const query = {
        text: 'SELECT * FROM playlist WHERE id = $1',
        values: [playlistId],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows.length) {
        throw new NotFoundError('Playlist song tidak ditemukan');
      }
      const owner = result.rows[0]
      if(owner.user_id !== userId){
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
      }
    }
  

  async verifySongInPlaylist(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlist_song WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan di dalam playlist');
    }
  }
}

module.exports = PlaylistSongService;
