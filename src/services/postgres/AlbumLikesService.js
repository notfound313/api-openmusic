const { Pool } = require('pg');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbumLike(albumId, userId) {
    const query = {
      text: 'INSERT INTO user_album_likes (album_id, user_id) VALUES($1, $2) RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    await this._pool.query(query);
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }

  async verifyAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }
}

module.exports = AlbumLikesService;
