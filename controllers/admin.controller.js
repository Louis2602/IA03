const MovieModel = require('../models/movie.model');
const FavoriteModel = require('../models/favorite.model');

const adminController = {
	getAdminPage: async (req, res) => {
		try {
			const movies = await MovieModel.getAllMovies();
			const favMovies = await FavoriteModel.getFavoriteMovies();
			res.render('authentication/admin', { movies, favMovies });
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
	addToFavorite: async (req, res) => {
		try {
			const { movieId } = req.body;
			// Check if movie already been added
			let msg;
			const foundFavMovie = await FavoriteModel.getFavoriteMovieById(
				movieId
			);
			if (foundFavMovie.length !== 0) {
				msg = 'Movie has already been added to favorites';
				res.status(200).json({ message: msg });
			} else {
				const movie = await MovieModel.getMovieDetail(movieId);
				msg = await FavoriteModel.addToFavorite(movie);
				res.status(200).json({ message: msg });
			}
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
	removeFromFavorite: async (req, res) => {
		try {
			const { movieId } = req.body;
			const msg = await FavoriteModel.removeFromFavorite(movieId);
			res.status(200).json({ message: msg });
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
};

module.exports = adminController;
