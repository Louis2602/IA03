const ActorModel = require('../models/actor.model');

const actorController = {
	getActorInfo: async (req, res) => {
		try {
			const actorId = req.params.actorId;
			const actor = await ActorModel.getActorById(actorId);
			const castMovies = await ActorModel.getCastMoviesOfActor(actorId);

			res.render('actors/actorDetail', { actor, castMovies });
		} catch (err) {
			res.status(err.statusCode).render('error', {
				code: err.statusCode,
				msg: 'Server error',
				description: err.message,
			});
		}
	},
};

module.exports = actorController;
