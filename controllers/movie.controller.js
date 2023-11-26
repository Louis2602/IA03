const MovieModel = require('../models/movie.model');
const ReviewModel = require('../models/review.model');

const movieController = {
	getAllMovies: async (req, res) => {
		try {
			let movies = await MovieModel.getAllMovies();
			return movies;
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
	getTop5Rating: async (req, res) => {
		try {
			const movies = await MovieModel.getTop5Rating();
			return movies;
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
	getTopBoxOffice: async (req, res) => {
		try {
			const movies = await MovieModel.getTopBoxOffice();
			return movies;
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
	getMovieDetail: async (req, res) => {
		const movieId = req.params.movieId;
		try {
			const movieInfo = await MovieModel.getMovieDetail(movieId);
			const movieActors = await MovieModel.getMovieActors(movieId);
			const similarMovies = await MovieModel.getSimilarMovies(movieId);
			const { reviews, total_page } =
				await ReviewModel.getReviewsByMovieId(movieId, 1, 2);

			res.render('movies/movieDetail', {
				movieInfo,
				movieActors,
				similarMovies,
				reviews,
				total_page,
			});
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
};

module.exports = movieController;
