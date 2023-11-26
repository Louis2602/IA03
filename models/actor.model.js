const { initializeDb } = require('../db');

const ActorModel = {
	getActorById: async (actorId) => {
		try {
			const db = await initializeDb();
			const actor = await db.one('SELECT * FROM names WHERE id = $1', [
				actorId,
			]);

			return actor;
		} catch (error) {
			throw new Error('Failed to get actors');
		}
	},
	getCastMoviesOfActor: async (actorId) => {
		try {
			const db = await initializeDb();
			const castMovieIds = await db.any(
				'SELECT movie_id FROM cast_movie_names WHERE name_id = $1',
				[actorId]
			);

			const castMoviesInfoPromises = castMovieIds.map(async (cmObj) => {
				const { movie_id } = cmObj;
				const castMovieInfo = await db.oneOrNone(
					'SELECT * FROM movies WHERE id = $1',
					[movie_id]
				);

				return castMovieInfo;
			});

			const castMovies = await Promise.all(castMoviesInfoPromises);
			// Filter out any null values and flatten the array of movie objects
			return castMovies.filter((movie) => movie !== null);
		} catch (error) {
			if (
				error.name === 'QueryResultError' &&
				error.message.startsWith('No data returned from the query.')
			) {
				return [];
			} else {
				throw new Error('Failed to get all cast movies of actor');
			}
		}
	},
};

module.exports = ActorModel;
