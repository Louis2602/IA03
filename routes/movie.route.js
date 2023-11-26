const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

router.get('/', movieController.getAllMovies);
router.get('/top5rating', movieController.getTop5Rating);
router.get('/topboxoffice', movieController.getTopBoxOffice);
router.get('/:movieId', movieController.getMovieDetail);

module.exports = router;
