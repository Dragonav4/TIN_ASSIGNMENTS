const express = require('express');
const applicationController = require('./application.controller');

const router = express.Router();

router.get('/', applicationController.showApplicationForm);
router.post('/', applicationController.submitApplication);
router.post('/api/submit', applicationController.submitApplicationAsync);
router.get('/api/status', applicationController.getBunkerStatus);

module.exports = router;
