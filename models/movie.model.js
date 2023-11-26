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
			const top5rating = await db.many(
				`SELECT * FROM movies WHERE imdbrating is not NULL AND imdbrating != '' ORDER BY imdbrating DESC LIMIT 5`
			);

			return top5rating;
		} catch (error) {
			throw new Error('Failed to get all movies');
		}
	},
	getTopBoxOffice: async (page, per_page) => {
		try {
			const db = await initializeDb();
			const offset = (page - 1) * per_page;
			const query = `
            SELECT * 
            FROM movies  
            WHERE boxoffice IS NOT NULL 
                AND boxoffice != '' 
                AND boxoffice != 'NA' 
            ORDER BY CAST(REPLACE(REPLACE(boxoffice, '$', ''), ',', '') AS DECIMAL) DESC 
            LIMIT ${per_page} OFFSET ${offset};
        `;
			const movies = await db.many(query);
			return movies;
		} catch (error) {
			throw new Error('Failed to get top box office movies');
		}
	},
	getTopFavorites: async (page, per_page) => {
		try {
			const db = await initializeDb();
			const offset = (page - 1) * per_page;
			const topfavorites = await db.many(
				`SELECT * FROM movies WHERE imdbrating is not NULL AND imdbrating != '' ORDER BY imdbrating DESC OFFSET $1 LIMIT $2`,
				[offset, per_page]
			);
			return topfavorites;
		} catch (error) {
			throw new Error('Failed to get top favorites movies');
		}
	},
	getMovieDetail: async (movieId) => {
		try {
			const db = await initializeDb();
			const movie = await db.one(
				'SELECT * FROM movies WHERE id = $1 LIMIT 1',
				[movieId]
			);
			return movie;
		} catch (err) {
			throw new Error('Failed to get movie information');
		}
	},
	getMovieActors: async (movieId) => {
		try {
			const db = await initializeDb();
			const movie_actors = await db.many(
				'SELECT * FROM movie_actors WHERE movie_id = $1',
				[movieId]
			);
			const actorInfoPromises = movie_actors.map(async (actorObj) => {
				const { actor_id } = actorObj;
				const actorInfo = await db.oneOrNone(
					'SELECT * FROM names WHERE id = $1',
					[actor_id]
				);
				return { ...actorObj, ...actorInfo };
			});

			const actorsInfo = await Promise.all(actorInfoPromises);
			return actorsInfo;
		} catch (err) {
			throw new Error('Failed to get movie actors');
		}
	},
	getSimilarMovies: async (movieId) => {
		try {
			const db = await initializeDb();
			const similar_movies = await db.many(
				'SELECT * FROM movie_similars WHERE movie_id = $1',
				[movieId]
			);
			const similarInfoPromises = similar_movies.map(
				async (similarObj) => {
					const { similar_movie_id } = similarObj;
					const similarInfo = await db.one(
						'SELECT * FROM movies WHERE id = $1',
						[similar_movie_id]
					);
					return { ...similarObj, ...similarInfo };
				}
			);

			const similarsInfo = await Promise.all(similarInfoPromises);
			return similarsInfo;
		} catch (err) {
			if (
				err.name === 'QueryResultError' &&
				err.message === 'No data returned from the query.'
			) {
				return [];
			} else {
				throw new Error('Failed to get similar movies');
			}
		}
	},
	searchMovies: async (searchQuery) => {
		try {
			const db = await initializeDb();
			const query =
				'select * from movies where title ilike $1 or genrelist ilike $1';
			const movies = await db.any(query, [`%${searchQuery}%`]);

			return movies;
		} catch (err) {
			if (
				err.name === 'queryresulterror' &&
				err.message === 'no data returned from the query.'
			) {
				return [];
			} else {
				console.log(err);
				throw new error('no movies found');
			}
		}
	},
};

module.exports = MovieModel;
