const { initializeDb } = require('../db');

const FavoriteModel = {
	addToFavorite: async (movie) => {
		try {
			const db = await initializeDb();
			const query = `
            INSERT INTO favorite_movies (id, title, originalTitle, fullTitle, year, image, releaseDate, runtimeStr, plot, awards, genreList, companies, countries, languages, imDbRating, boxOffice, plotFull)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            `;

			await db.none(query, [
				movie.id,
				movie.title,
				movie.originaltitle,
				movie.fulltitle,
				movie.year,
				movie.image,
				movie.releasedate,
				movie.runtimestr,
				movie.plot,
				movie.awards,
				movie.genrelist,
				movie.companies,
				movie.countries,
				movie.languages,
				movie.imdbrating,
				movie.boxoffice,
				movie.plotfull,
			]);

			return 'Add new movie to favorites successful';
		} catch (error) {
			console.error('Failed to add movie to favorites:', error);
			throw new Error('Failed to add movie to favorites');
		}
	},
	getFavoriteMovies: async (movie) => {
		try {
			const db = await initializeDb();
			const fav_movies = await db.many('select * from favorite_movies');
			return fav_movies;
		} catch (error) {
			if (
				error.name === 'QueryResultError' &&
				error.message === 'No data returned from the query.'
			) {
				return [];
			} else {
				throw new Error('Failed to get favorite movies');
			}
		}
	},
	removeFromFavorite: async (movieId) => {
		try {
			const db = await initializeDb();
			await db.none('DELETE FROM favorite_movies WHERE id = $1', [
				movieId,
			]);

			return 'Remove movie to favorites successful';
		} catch (error) {
			console.error('Failed to add movie to favorites:', error);
			throw new Error('Failed to add movie to favorites');
		}
	},
	getFavoriteMovieById: async (movieId) => {
		try {
			const db = await initializeDb();
			const fav_movies = await db.any(
				`select * from favorite_movies where id = '${movieId}'`
			);
			return fav_movies;
		} catch (error) {
			if (
				error.name === 'QueryResultError' &&
				error.message === 'No data returned from the query.'
			) {
				return [];
			} else {
				throw new Error('Failed to get favorite movies');
			}
		}
	},
	getFavoriteMovies: async () => {
		try {
			const db = await initializeDb();
			const fav_movies = await db.many('select * from favorite_movies');
			return fav_movies;
		} catch (error) {
			if (
				error.name === 'QueryResultError' &&
				error.message === 'No data returned from the query.'
			) {
				return [];
			} else {
				throw new Error('Failed to get favorite movies');
			}
		}
	},
};

module.exports = FavoriteModel;
