/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
    // tabel album
    pgm.createTable('album', {
      album_id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      
      },
      name: {
        type: 'TEXT',
        notNull: true,
      },
      year: {
        type: 'INTEGER',
        notNull: true,
      },
      created_at: {
        type: 'TEXT',
        notNull: true,
      },
      updated_at: {
        type: 'TEXT',
        notNull: true,
      },
    });
  
    //  tabel song dengan relasi ke album
    pgm.createTable('song', {
      song_id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
       
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      year: {
        type: 'INTEGER',
        notNull: true,
      },
      performer: {
        type: 'TEXT',
        notNull: true,
      },
      genre: {
        type: 'VARCHAR(25)',
        notNull: true,
      },
      duration: {
        type: 'INTEGER',
        notNull: false,
      },
      album_id: {
        type: 'varchar(50)',
        references: 'album', // Referensi ke tabel album
        onDelete: 'cascade', // Jika album dihapus, hapus semua lagu terkait
        notNull: false, // Kolom ini harus ada
      },
      created_at: {
        type: 'TEXT',
        notNull: true,
      },
      updated_at: {
        type: 'TEXT',
        notNull: true,
      },
    });
  
    //  indeks untuk kolom album_id di tabel song untuk meningkatkan performa query
    pgm.createIndex('song', 'album_id');
  };
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
    // Hapus tabel secara berurutan
    pgm.dropTable('song');
    
    
    pgm.dropTable('album');
  };