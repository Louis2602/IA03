const { initializeDb } = require('../db');

const ReviewModel = {
	getReviewsByMovieId: async (movieId) => {
		try {
			const db = await initializeDb();
			let reviews = await db.many(
				`select * from reviews where movie_id = '${movieId}'`
			);

			return reviews;
		} catch (error) {
			if (
				error.name === 'QueryResultError' &&
				error.message === 'No data returned from the query.'
			) {
				return [];
			} else {
				throw new Error('Failed to get all reviews from movie');
			}
		}
	},
};

module.exports = ReviewModel;
