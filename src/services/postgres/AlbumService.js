const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBtoAlbum, mapDBtoSong } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  // add album
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO album (album_id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING album_id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError('album gagal ditambahkan');
    }

    await this._cacheService.delete('albums');
    return result.rows[0].album_id;
  }

  // get album
  async getAlbums() {
    try {
      const result = await this._cacheService.get('albums');
      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query('SELECT * FROM album');
      const mappedResult = result.rows.map(mapDBtoAlbum);
      await this._cacheService.set('albums', JSON.stringify(mappedResult));
      return mappedResult;
    }
  }

  async getAlbumById(id) {
    try {
      const result = await this._cacheService.get(`album:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM album WHERE album_id = $1',
        values: [id],
      };
      const querySong = {
        text: 'SELECT song_id, title, performer FROM song WHERE album_id = $1',
        values: [id],
      };
      const albums = await this._pool.query(query);
      const songs = await this._pool.query(querySong);
      if (!albums.rows.length) {
        throw new NotFoundError('id Album tidak ditemukan');
      }

      const result = {
        ...albums.rows.map(mapDBtoAlbum)[0],
        songs: songs.rows.map(mapDBtoSong),
      };

      await this._cacheService.set(`album:${id}`, JSON.stringify(result));
      return result;
    }
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE album_id = $4 RETURNING album_id',
      values: [name, year, updatedAt, id],

    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memeperbarui album, id tidak ditemukan');
    }

    await this._cacheService.delete(`album:${id}`);
    await this._cacheService.delete('albums');
  }

  // delete album
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album, id tidak ditemukan');
    }

    await this._cacheService.delete(`album:${id}`);
    await this._cacheService.delete('albums');
  }

  // get album and song
  async getAlbumSongById(id) {
    try {
      const result = await this._cacheService.get(`albumSong:${id}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT album_id,name,year FROM album WHERE album_id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Gagal mendapatkan album, id tidak ditemukan');
      }
      const album = result.rows.map(mapDBtoAlbum)[0];
      const querySong = {
        text: 'SELECT song_id, title, performer FROM song WHERE album_id = $1',
        values: [id],
      };
      const resultSong = await this._pool.query(querySong);
      const songs = resultSong.rows.map(mapDBtoSong);
      const albumWithSongs = {
        ...album,
        songs,
      };

      await this._cacheService.set(`albumSong:${id}`, JSON.stringify(albumWithSongs));
      return albumWithSongs;
    }
  }

  async verifyAlbum(album_id) {
    const query = {
      text: 'SELECT * FROM album WHERE album_id = $1',
      values: [album_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async addOrUpdateCover(id, coverUrl) {
    const query = {
      text: 'UPDATE album SET cover = $1 WHERE album_id = $2 RETURNING album_id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui cover album, id tidak ditemukan');
    }

    await this._cacheService.delete(`album:${id}`);
    await this._cacheService.delete(`albumSong:${id}`);
    await this._cacheService.delete('albums');
  }
}
module.exports = { AlbumService };
