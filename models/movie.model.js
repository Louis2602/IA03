const { initializeDb } = require('../db');

const MovieModel = {
	getAllMovies: async () => {
		try {
			const db = await initializeDb();

			const movies = db.many('select * from movies');
			return movies;
		} catch (error) {
			throw new Error('Failed to get all movies');
		}
	},
};

module.exports = MovieModel;
