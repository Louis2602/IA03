const MovieModel = require('../models/movie.model');
const ActorModel = require('../models/actor.model');

const searchController = {
	searchMovies: async (req, res) => {
		try {
			const searchQuery = req.query.query;
			const foundMovies = await MovieModel.searchMovies(searchQuery);

			res.render('search/searchPage', { data: foundMovies, searchQuery });
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
	searchActors: async (req, res) => {
		try {
			const searchQuery = req.query.query;
			const foundActors = await ActorModel.searchActors(searchQuery);

			res.render('search/searchActorPage', {
				data: foundActors,
				searchQuery,
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
module.exports = searchController;
