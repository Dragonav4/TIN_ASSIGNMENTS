const genresRepository = require('./genres.repository');

function genresMiddleware(req, res, next) {
    genresRepository.findAllGenres((err, genres) => {
        if (err) return next(err);
        res.locals.genres = genres;
        next();
    });
}

module.exports = genresMiddleware;
