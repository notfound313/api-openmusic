const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBPlaylist } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addPlaylist(name, userId) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist VALUES($1,$2,$3) RETURNING id',
      values: [id, name, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this._cacheService.delete(`playlists:${userId}`);
    return result.rows[0].id;
  }

  async getAllPlaylist(credentialId) {
    try {
      const result = await this._cacheService.get(`playlists:${credentialId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT DISTINCT playlist.id , playlist.name, users.username
        FROM playlist 
        LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
        LEFT JOIN users ON users.id = playlist.user_id
        WHERE playlist.user_id = $1 OR collaborations.user_id = $1
        OR users.id = $1
        `,
        values: [credentialId],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`playlists:${credentialId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async getPlaylistById(id) {
    try {
      const result = await this._cacheService.get(`playlist:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM playlist WHERE id=$1',
        values: [id],
      };

      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Gagal mendapatkan playlist. id tidak ditemukan');
      }

      await this._cacheService.set(`playlist:${id}`, JSON.stringify(result.rows[0]));
      return result.rows[0];
    }
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id=$1 RETURNING id, user_id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlits, id tidak ditemukan');
    }

    const { user_id } = result.rows[0];
    await this._cacheService.delete(`playlists:${user_id}`);
    await this._cacheService.delete(`playlist:${id}`);
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.user_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistService;
