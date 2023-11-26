const MovieModel = require('../models/movie.model');

const indexController = {
	getData: async (req, res) => {
		try {
			const top5Movies = await MovieModel.getTop5Rating();
			const topBoxOffice = await MovieModel.getTopBoxOffice(1, 3);

			res.render('index', { top5Movies, topBoxOffice });
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	topBoxOffice: async (req, res) => {
		const { page } = req.query;
		const per_page = 3;

		try {
			const topBoxOfficeData = await MovieModel.getTopBoxOffice(
				page,
				per_page
			);

			res.json({ page: page, data: topBoxOfficeData });
		} catch (error) {
			console.error('Error in topBoxOffice:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
	topFavorites: async (req, res) => {
		const { page } = req.query;
		const per_page = 3;

		try {
			const topBoxOfficeData = await MovieModel.getTopFavorites(
				page,
				per_page
			);

			res.json({ page: page, data: topBoxOfficeData });
		} catch (error) {
			console.error('Error in top favorites:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

module.exports = indexController;
