const MovieModel = require('../models/movie.model');
const ReviewModel = require('../models/review.model');

const movieController = {
	getAllMovies: async (req, res) => {
		try {
			let movies = await MovieModel.getAllMovies();
			return movies;
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	getTop5Rating: async (req, res) => {
		try {
			const movies = await MovieModel.getTop5Rating();
			return movies;
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	getTopBoxOffice: async (req, res) => {
		try {
			const movies = await MovieModel.getTopBoxOffice();
			return movies;
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	getMovieDetail: async (req, res) => {
		const movieId = req.params.movieId;
		try {
			const movieInfo = await MovieModel.getMovieDetail(movieId);
			const reviews = await ReviewModel.getReviewsByMovieId(movieId);
			res.render('movies/movieDetail', { movieInfo, reviews });
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
};

module.exports = movieController;
