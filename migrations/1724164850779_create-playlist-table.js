const { addColumns } = require('node-pg-migrate/dist/operations/tables/addColumns');

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
    pgm.createTable('playlist',{
        id : {
            type : 'VARCHAR(50)',
            primaryKey : true
        },
        song_id :{
            type : 'VARCHAR(50)',
            notNull: true,
        },
        user_id : {
            type: 'VARCHAR(50)',
            notNull : true,
        }
    });

    pgm.addConstraint('playlist','unique_song_id_and_user_id', 'UNIQUE(song_id, user_id)');

    pgm.addConstraint('playlist', 'fk_playlist.song_id_song.song_id','FOREIGN KEY(song_id) REFERENCES song(song_id) ON DELETE CASCADE');
    pgm.addConstraint('playlist', 'fk_playlist.user_id_users.id','FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist')
};
