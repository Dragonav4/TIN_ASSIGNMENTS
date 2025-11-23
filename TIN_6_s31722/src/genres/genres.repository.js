const db = require('../database');

function findAllGenres(callback) {
  db.all('SELECT id, name FROM genres ORDER BY name', [], callback);
}

module.exports = {
  findAllGenres,
};
