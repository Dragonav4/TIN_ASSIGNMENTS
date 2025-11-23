const {GAME_STATUSES} = require('./games.constants');

function isNumeric(value) {
    return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

function normalizeInt(value) {
    if (!isNumeric(value)) {
        return '';
    }
    return String(value).trim();
}

function validateGamePayload(payload = {}) {
    const errors = [];
    const values = {
        title: (payload.title || '').trim(),
        platform: (payload.platform || '').trim(),
        status: (payload.status || '').trim(),
        rating: normalizeInt(payload.rating),
        genre_id: (payload.genre_id || '').trim(),
    };

    if (!values.title) errors.push('Title is required.');
    if (!values.platform) errors.push('Platform is required.');
    if (!values.status) errors.push('Status is required.');
    else if (!GAME_STATUSES.includes(values.status)) errors.push('Status value is not valid.');

    if (values.rating !== '') {
        const numericRating = Number(values.rating);
        if (Number.isNaN(numericRating) ||
            numericRating < 1 ||
            numericRating > 10) {
            errors.push('Rating must be a number between 1 and 10.');
        } else {
            values.rating = numericRating;
        }
    } else {
        values.rating = '';
    }

    if (!values.genre_id) errors.push('Genre must be selected.');
    else if (Number.isNaN(Number(values.genre_id))) errors.push('Genre must be a valid option.');

    return {values, errors};
}

module.exports = {
    validateGamePayload,
};
