const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBPlaylist } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
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

    return result.rows[0].id;
  }

  async getAllPlaylist(credentialId) {
    const query = {
      text: 'SELECT * FROM playlist WHERE user_id=$1',
      values: [credentialId],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBPlaylist);
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan playlist. id tidak ditemukan');
    }
    return result.rows[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlits, id tidak ditemukan');
    }
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
