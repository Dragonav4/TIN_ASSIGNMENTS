const path = require('path');
const sqlite3 = require('sqlite3')

const dbPath = path.join(__dirname, '..', 'db', 'game_backlog.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database', err);
    throw err;
  }
  db.run('PRAGMA foreign_keys = ON');
});

module.exports = db;
