const express = require('express');
const path = require('path');

const applicationRouter = require('./src/application/application.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => res.redirect('/application'));
app.use('/application', applicationRouter);

app.use((err, req, res, _) => {
    console.error(err);
    res.status(500).send('Internal server error');
});

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

module.exports = app;
