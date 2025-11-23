const db = require('../database');

function findAll(callback) {
    db.all('SELECT * FROM games ORDER BY id DESC', [], callback);
}

function findById(id, callback) {
    db.get('SELECT * FROM games WHERE id = ?', [id], callback);
}

function insert({title, platform, status, rating, genre_id}, callback) {
    const normalizedRating = rating === '' || rating == null ? null : Number(rating);
    const sql = `INSERT INTO games (title, platform, status, rating, genre_id)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [title, platform, status, normalizedRating, genre_id];

    db.run(sql, params, function runCallback(err) {
        if (err) return callback(err);
        callback(null, {
            id: this.lastID,
            title,
            platform,
            status,
            rating: normalizedRating,
            genre_id,
        });
    });
}

function update(id, {title, platform, status, rating, genre_id}, callback) {
    const normalizedRating = rating === '' || rating == null ? null : Number(rating);
    const sql = `UPDATE games
                 SET title    = ?,
                     platform = ?,
                     status   = ?,
                     rating   = ?,
                     genre_id = ?
                 WHERE id = ?`;
    const params = [title, platform, status, normalizedRating, genre_id, id];

    db.run(sql, params, function runCallback(err) {
        if (err) return callback(err);
        callback(null, {changes: this.changes});
    });
}

function deleteById(id, callback) {
    db.run('DELETE FROM games WHERE id = ?', [id], function runCallback(err) {
        if (err) return callback(err);
        callback(null, {changes: this.changes});
    });
}

module.exports = {
    findAll,
    findById,
    insert,
    update,
    deleteById,
};
