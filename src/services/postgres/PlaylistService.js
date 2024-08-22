const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");


class PlaylistService{
    constructor() {
        this._pool = new Pool();
      }

    async addPlaylist(songId, userId){
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist VALUES($1,$2,$3) RETURNING id',
            values: [id,songId, userId],
        }

        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new InvariantError('Playlist gagal ditambahkan')
            
        }

        return result.rows[0].id;
    }

    async deletePlaylist(song_id,user_id){
        
    }


}