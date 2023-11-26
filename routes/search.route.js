const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/movies', searchController.searchMovies);
router.get('/actors', searchController.searchActors);

module.exports = router;
