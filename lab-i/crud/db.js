const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(path.join(__dirname, 'data.db'));

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      published_year INTEGER NOT NULL,
      genre TEXT NOT NULL
    )
  `);

  const count = db.prepare('SELECT COUNT(*) AS count FROM books').get().count;

  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO books (title, author, published_year, genre)
      VALUES (?, ?, ?, ?)
    `);

    insert.run('The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy');
    insert.run('Solaris', 'Stanislaw Lem', 1961, 'Science fiction');
    insert.run('Clean Code', 'Robert C. Martin', 2008, 'Programming');
  }
}

module.exports = {
  db,
  initDb,
};
