const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');

router.get('/', indexController.getData);
router.get('/topboxoffice', indexController.topBoxOffice);
router.get('/topfavorites', indexController.topFavorites);

module.exports = router;
