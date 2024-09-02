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
    pgm.createTable('user_album_likes',{
        id : {
            type: 'VARCHAR(50)',
            primaryKey : true,
            
        },
        user_id : {
            type:'VARCHAR(50)',
            references: 'users(id)',
            notNull: true,
        },
        album_id : {
            type : 'VARCHAR(50)',
            references: 'album(album_id)',
            notNull: true,
        }

    });

    pgm.addConstraint('user_album_likes','unique_user_id_and_album_id',{
        unique:['user_id', 'album_id'],
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('user_album_likes');
};
