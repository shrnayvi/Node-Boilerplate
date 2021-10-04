const { Router } = require('express');

const tokenController = require('../controllers/userToken.controller')();

const router = Router();

router.post('/refresh', tokenController.renewAccessToken);

module.exports = router;
