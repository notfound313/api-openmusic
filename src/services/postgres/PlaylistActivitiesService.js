const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const id = `playlistactivity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_activity VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, action, time, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist activity gagal ditambahkan');
    }
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `SELECT users.username, song.title, playlist_activity.action, playlist_activity.time
             FROM playlist_activity
             LEFT JOIN users ON users.id = playlist_activity.user_id
             LEFT JOIN song ON song.song_id = playlist_activity.song_id
             WHERE playlist_activity.playlist_id = $1
             ORDER BY playlist_activity.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;
