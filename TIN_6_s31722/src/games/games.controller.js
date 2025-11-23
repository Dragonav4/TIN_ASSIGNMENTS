const {GAME_STATUSES} = require('./games.constants');
const gamesRepository = require('./games.repository');
const {validateGamePayload} = require('./games.validate');

function mapValuesToRepository(values) {
    return {
        title: values.title,
        platform: values.platform,
        status: values.status,
        rating: values.rating === '' ? null : values.rating,
        genre_id: Number(values.genre_id),
    };
}

function listGames(req, res, next) {
    gamesRepository.findAll((err, games) => {
        if (err) return next(err);

        res.render('games/index', {
            games,
            statuses: GAME_STATUSES,
        });
    });
}

function showAddForm(req, res) {
    res.render('games/new', {
        game: {},
        errors: [],
    });
}

function showEditForm(req, res, next) {
    gamesRepository.findById(req.params.id, (err, game) => {
        if (err) return next(err);
        if (!game) {
            res.status(404).send('Game not found');
            return;
        }

        res.render('games/edit', {
            game,
            errors: [],
        });
    });
}

function createGame(req, res, next) {
    const {values, errors} = validateGamePayload(req.body);

    if (errors.length > 0) {
        res.status(400);
        res.render('games/new', {
            game: values,
            errors,
        });
        return;
    }

    gamesRepository.insert(mapValuesToRepository(values), (err) => {
        if (err) return next(err);
        res.redirect('/games');
    });
}

function updateGame(req, res, next) {
    const {values, errors} = validateGamePayload(req.body);

    if (errors.length > 0) {
        res.status(400);
        res.render('games/edit', {
            game: {...values, id: req.params.id}, // take all fiels from vals(like json) add id to it and render
            errors,
        });
        return;
    }

    gamesRepository.findById(req.params.id, (err, existing) => {
        if (err) return next(err);
        if (!existing) {
            res.status(404).send('Game not found');
            return;
        }

        gamesRepository.update(req.params.id, mapValuesToRepository(values), (updateErr) => {
            if (updateErr) return next(updateErr);
            res.redirect('/games');
        });
    });
}

function deleteGameConfirm(req, res, next) {
    gamesRepository.findById(req.params.id, (err, game) => {
        if (err) return next(err);
        if (!game) {
            res.status(404).send('Game not found');
            return;
        }

        res.render('games/delete', {game});
    });
}

function deleteGame(req, res, next) {
    const confirm = req.body.confirm;
    if (confirm !== 'yes') {
        res.redirect('/games');
        return;
    }

    gamesRepository.deleteById(req.params.id, (err) => {
        if (err) return next(err);
        res.redirect('/games');
    });
}

module.exports = {
    listGames,
    showAddForm,
    createGame,
    showEditForm,
    updateGame,
    deleteGameConfirm,
    deleteGame,
};
