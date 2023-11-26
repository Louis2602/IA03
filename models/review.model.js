const { initializeDb } = require('../db');

const ReviewModel = {
	getReviewsByMovieId: async (movieId, page, per_page) => {
		try {
			const db = await initializeDb();
			const offset = (page - 1) * per_page;
			const reviews = await db.many(
				`select * from reviews where movie_id = '${movieId}' OFFSET ${offset} LIMIT ${per_page}`
			);

			const totalReviewsCount = await db.one(
				`SELECT COUNT(*) FROM reviews WHERE movie_id = '${movieId}'`
			);

			const total_page = Math.ceil(totalReviewsCount.count / per_page);

			return { reviews, total_page };
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
