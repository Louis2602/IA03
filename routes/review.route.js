const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.get('/reviews/:movieId', reviewController.getReviewsByMovieId);

module.exports = router;
