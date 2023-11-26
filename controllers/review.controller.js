const ReviewModel = require('../models/review.model');

const reviewController = {
	getReviewsByMovieId: async (req, res) => {
		try {
			const movieId = req.params.movieId;
			const { page } = req.query;
			const per_page = 2;
			let reviews = await ReviewModel.getReviewsByMovieId(
				movieId,
				page,
				per_page
			);
			res.json({ reviews });
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
};

module.exports = reviewController;
