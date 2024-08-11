const { nanoid } = require( 'nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBtoAlbum, mapDBtoSong } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');


class OpenMusicService {
  constructor() {
    this._pool = new Pool();
  }
  //add album
  async addAlbum({name, year}) {
    const id =`album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    

    const query = {
      text: 'INSERT INTO album (album_id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING album_id',
      values: [id,name, year, createdAt, updatedAt],
    };
    
    const result = await this._pool.query(query);
   
    
    if(!result.rows[0].album_id){
      throw new InvariantError('album gagal ditambahkan');
    }
    return result.rows[0].album_id;

  }

  //get album
  async getAlbums(){
    const result = await this._pool.query('SELECT * FROM album');
    return result.rows.map(mapDBtoAlbum);
  }
  
  async getAlbumById(id){
    const query = {
      text: 'SELECT * FROM album WHERE album_id = $1',
      values : [id],
    }
    const querySong = {
      text : 'SELECT song_id, title, performer FROM song WHERE album_id = $1',
      values : [id],
    }
    const albums = await this._pool.query(query);
    const songs = await this._pool.query(querySong);
    if (!albums.rows.length){
      throw new NotFoundError('id Album tidak ditemukan');
      
    }
    

    return {
      ...albums.rows.map(mapDBtoAlbum)[0],
      songs: songs.rows.map(mapDBtoAlbum),
    }
  }
  async editAlbumById(id, {name, year}){
    const updatedAt = new Date().toISOString();
    const query ={
      text: 'UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE album_id = $4 RETURNING album_id',
      values:[name,year,updatedAt,id],
      
    }
    const result = await this._pool.query(query);
    if(!result.rows.length){
      throw new NotFoundError('Gagal memeperbarui album, id tidak ditemukan');
    }
   
  }

  //delete album
  async deleteAlbumById(id){
    const query = {
      text : 'DELETE FROM album WHERE album_id = $1 RETURNING album_id',
      values : [id],
    }
    const result = await this._pool.query(query);
    if(!result.rows.length){
      throw new NotFoundError('Gagal menghapus album, id tidak ditemukan');
    }
  }
  //add song
  async addSong({title,year,performer,genre,duration, albumId}){
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO song (song_id, title, year, performer, genre, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id'
,
      values : [id,title, year,performer,genre,duration, albumId,createdAt,updatedAt],
    }
 
    const result = await this._pool.query(query);
    
    if(!result.rows.length || !result.rows[0].song_id){
      throw new InvariantError('Gagal menambahkan lagu');
    }
    return result.rows[0].song_id;
  }
  //get song
  async getSongs({ title, performer }){
    let textQuery;
    if(title && performer){
      textQuery = {
        text : 'SELECT song_id, title, performer FROM song WHERE title ILIKE $1 AND performer ILIKE $2',
        values : [`%${title}%`,`%${performer}%`],
      }
    }else if(title){
      textQuery = {
        text : 'SELECT song_id, title, performer FROM song WHERE title ILIKE $1',
        values : [`%${title}%`],
      }
    }else if(performer){
      textQuery = {
        text : 'SELECT song_id, title, performer FROM song WHERE performer ILIKE $1',
        values : [`%${performer}%`],
      }
    }else{
      textQuery = {
        text : 'SELECT song_id, title, performer FROM song',
      }
    }
    const result = await this._pool.query(textQuery);
    
    return result.rows.map(mapDBtoSong);
  }

  //get song by id
  async getSongById(id){
    const query = {
      text : 'SELECT * FROM song WHERE song_id = $1',
      values : [id],
    }
    const result = await this._pool.query(query);
    
    if(!result.rows.length){
      throw new NotFoundError('Gagal mendapatkan lagu, id tidak ditemukan');
    }
    return result.rows.map(mapDBtoSong)[0];
  }
  //edit song
  async editSongById(id, {title, year,performer,genre,duration, albumId}){
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE song_id = $8 RETURNING song_id',
      values : [title, year ,performer,genre,duration, albumId,updatedAt,id],
    }
    
    const result = await this._pool.query(query);
   
    if(!result.rows.length){
      throw new NotFoundError('Gagal memeperbarui lagu, id tidak ditemukan');
    }
  }
  //delete song
  async deleteSongById(id){
    const query = {
      text : 'DELETE FROM song WHERE song_id = $1 RETURNING song_id',
      values : [id],
    }
    const result = await this._pool.query(query);
    if(!result.rows.length){
      throw new NotFoundError('Gagal menghapus lagu, id tidak ditemukan');
    }
  }

  //get album and song
  async getAlbumSongById(id){
    const query = {
      text : 'SELECT album_id,name,year FROM album WHERE album_id = $1',
      values : [id],
    }
    const result = await this._pool.query(query);
    if(!result.rows.length){
      throw new NotFoundError('Gagal mendapatkan album, id tidak ditemukan');
    }
    const album = result.rows.map(mapDBtoAlbum)[0];
    const querySong = {
      text : 'SELECT song_id, title, performer FROM song WHERE album_id = $1',
      values : [id],
    }
    const resultSong = await this._pool.query(querySong);
    const songs = resultSong.rows.map(mapDBtoSong);
    return {
      ...album,
      songs,
    }
  }
}
  module.exports = {OpenMusicService}