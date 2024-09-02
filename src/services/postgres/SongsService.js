const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBtoSong } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  // add song
  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO song (song_id, title, year, performer, genre, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length || !result.rows[0].song_id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    await this._cacheService.delete('song');
    return result.rows[0].song_id;
  }

  // get song
  async getSongs({ title, performer }) {
    try {
      const result = await this._cacheService.get('song');
      return JSON.parse(result);
    } catch (error) {
      let textQuery;
      if (title && performer) {
        textQuery = {
          text: 'SELECT song_id, title, performer FROM song WHERE title ILIKE $1 AND performer ILIKE $2',
          values: [`%${title}%`, `%${performer}%`],
        };
      } else if (title) {
        textQuery = {
          text: 'SELECT song_id, title, performer FROM song WHERE title ILIKE $1',
          values: [`%${title}%`],
        };
      } else if (performer) {
        textQuery = {
          text: 'SELECT song_id, title, performer FROM song WHERE performer ILIKE $1',
          values: [`%${performer}%`],
        };
      } else {
        textQuery = {
          text: 'SELECT song_id, title, performer FROM song',
        };
      }
      const result = await this._pool.query(textQuery);

      const mappedResult = result.rows.map(mapDBtoSong);
      await this._cacheService.set('song', JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  // get song by id
  async getSongById(id) {
    try {
      const result = await this._cacheService.get(`song:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM song WHERE song_id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Gagal mendapatkan lagu, id tidak ditemukan');
      }

      const mappedResult = result.rows.map(mapDBtoSong)[0];
      await this._cacheService.set(`song:${id}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  // edit song
  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE song_id = $8 RETURNING song_id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memeperbarui lagu, id tidak ditemukan');
    }

    await this._cacheService.delete(`song:${id}`);
    
  }

  // delete song
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu, id tidak ditemukan');
    }

    await this._cacheService.delete(`song:${id}`);
   
  }
}

module.exports = { SongsService };
