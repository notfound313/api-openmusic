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
  pgm.addColumn('playlist_activity', {
    user_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('playlist_activity', 'fk_playlist_activity.user_id_usres.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumn('playlist_activity', 'user_id');
};
