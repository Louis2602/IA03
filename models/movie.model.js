const { initializeDb } = require('../db');

const MovieModel = {
	getAllMovies: async () => {
		try {
			const db = await initializeDb();
			const movies = await db.many('select * from movies');
			return movies;
		} catch (error) {
			throw new Error('Failed to get all movies');
		}
	},
	getTop5Rating: async () => {
		try {
			const db = await initializeDb();
			const movies = await db.many('select * from movies');
			movies.sort(
				(a, b) => parseFloat(b.imdbrating) - parseFloat(a.imdbrating)
			);
			const top5rating = movies.slice(0, 5);

			return top5rating;
		} catch (error) {
			throw new Error('Failed to get all movies');
		}
	},
	getTopBoxOffice: async () => {
		try {
			const db = await initializeDb();
			const query =
				"SELECT * FROM movies  WHERE boxoffice IS NOT NULL AND boxoffice != '' AND boxoffice != 'NA' ORDER BY CAST(REPLACE(REPLACE(boxoffice, '$', ''), ',', '') AS DECIMAL) DESC LIMIT 18;";
			const movies = await db.many(query);
			return movies;
		} catch (error) {
			throw new Error('Failed to get top box office movies');
		}
	},
	getMovieDetail: async (movieId) => {
		try {
			const db = await initializeDb();
			const movie = await db.one('SELECT * FROM movies WHERE id = $1', [
				movieId,
			]);
			return movie;
		} catch (err) {
			throw new Error('Failed to get movie information');
		}
	},
};

module.exports = MovieModel;
