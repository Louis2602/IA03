const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

router.get('/movies', movieController.getAllMovies);
router.get('/movies/top5rating', movieController.getTop5Rating);
router.get('/movies/topboxoffice', movieController.getTopBoxOffice);
router.get('/movies/:movieId', movieController.getMovieDetail);

module.exports = router;
