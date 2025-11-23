const express = require('express');
const path = require('path');

const gamesRouter = require('./src/games/games.routes');
const initDb = require('./db/init-db');
const app = express();

initDb();
app.set('view engine', 'ejs'); // by deafult templates would .ejs
app.set('views', path.join(__dirname, 'views')); //safety joins path and saying that here will be templates
// app.use its way to connect middleware or router
app.use(express.urlencoded({extended: false})); //parsing html to req.body
app.use(express.json()); //read and write info from json to req.body
app.use('/static', express.static(path.join(__dirname, 'static'))); // for giving css, images, js, fonts


app.get('/', (req, res) => res.redirect('/games')); //(req, res) => middleware
app.use('/games', gamesRouter);


//global exception handler(after next(err) execution, this rows will be invoked)
app.use((err, req, res, _) => {
    console.error(err);
    res.status(500).send('Internal server error');
});

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

if (require.main === module) { // node server.js => simple start, but if we would like to import as module it wont start and lie in variable and wait
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

module.exports = app;
