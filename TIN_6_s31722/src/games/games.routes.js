const express = require('express');

const gamesController = require('./games.controller');
const {GAME_STATUSES} = require('./games.constants');
const genresMiddleware = require('../genres/genres.middleware');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.statuses = GAME_STATUSES;
    next();
});

router.use(genresMiddleware);
/*
для любого запроса к /games…:
	•	сначала выполнится genresMiddleware(req, res, next),
	•	он сходить в БД, достанет жанры,
	•	в res.locals.genres,
 */
router.get('/', gamesController.listGames);
router.get('/new', gamesController.showAddForm);
router.post('/', gamesController.createGame);
router.get('/:id/edit', gamesController.showEditForm);
router.post('/:id/edit', gamesController.updateGame);
router.get('/:id/delete', gamesController.deleteGameConfirm);
router.post('/:id/delete', gamesController.deleteGame);

module.exports = router;
