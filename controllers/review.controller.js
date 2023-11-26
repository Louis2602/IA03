const ReviewModel = require('../models/review.model');

const reviewController = {
	getReviewsByMovieId: async (req, res) => {
		try {
			const movieId = req.params.movieId;
			let reviews = await ReviewModel.getReviewsByMovieId(movieId);
			return reviews;
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
};

module.exports = reviewController;
