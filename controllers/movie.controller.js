const MovieModel = require('../models/movie.model');

const movieController = {
	getAllMovies: async (req, res) => {
		try {
			let movies = await MovieModel.getAllMovies();
			movies = movies.slice(0, 5);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	getTop5Rating: async (req, res) => {
		try {
			const movies = await MovieModel.getAllMovies();
			movies.sort(
				(a, b) => parseFloat(b.imdbrating) - parseFloat(a.imdbrating)
			);

			const top5rating = movies.slice(0, 5);
			return top5rating;
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
};

module.exports = movieController;
