const { initializeDb } = require('../db');

const ReviewModel = {
	getReviewsByMovieId: async (movieId) => {
		try {
			const db = await initializeDb();
			const reviews = await db.many(
				`select * from reviews where movie_id = '${movieId}'`
			);
			return reviews;
		} catch (error) {
			throw new Error('Failed to get all reviews from movie');
		}
	},
};

module.exports = ReviewModel;
