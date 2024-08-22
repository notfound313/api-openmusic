/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addConstraint('playlist_song', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');

    pgm.addConstraint('playlist_song','fk_playlist_song.playlist_id_playlist.id',{
        foreignKeys : {
            columns:'playlist_id',
            references:'playlist(id)',
            onDelete:'CASCADE',            
        }
    });
    pgm.addConstraint('playlist_song','fk_playlist_song.song_id_song.id',{
        foreignKeys : {
            columns:'song_id',
            references:'song(song_id)',
            onDelete:'CASCADE',            
        }
    });
        

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropConstraint('playlist_song','fk_playlist_song.playlist_id_playlist.id')
    pgm.dropConstraint('playlist_song','fk_playlist_song.song_id_songs.id')
};
