const sqlite3 = require('sqlite3')
const fs = require('fs');
const path = require('path');
const db = new sqlite3.Database('db/game_backlog.db')

const createSchema = fs.readFileSync(path.join(__dirname, 'sql/create.sql'), 'utf-8');
const seedGenres = fs.readFileSync(path.join(__dirname, 'sql/seedGenres.sql'), 'utf-8');


function initDb() {
    db.serialize(() => {
        db.exec(createSchema, err => {
            if (err) console.error("Error creating database schema:", err);
            else console.log("Tables created.");
        })

        db.exec(seedGenres, err => {
            if (err) console.error("Error creating database seed:", err);
            else console.log("Tables seed:", seedGenres);
        })

        db.close(() => {
            console.log("Database initialized");
        })
    })
}
module.exports = initDb;
