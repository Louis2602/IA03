const pgp = require('pg-promise')({
	capSQL: true,
});
const fs = require('fs');

const cn = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_DB,
	user: process.env.DB_USER,
	password: process.env.DB_PW,
};

const db = pgp(cn);

const moviesTableQuery = `
CREATE TABLE IF NOT EXISTS movies (
	stt SERIAL,
    id VARCHAR(50),
    title TEXT,
    originalTitle TEXT,
    fullTitle TEXT,
    year VARCHAR(10),
    image TEXT,
    releaseDate DATE,
    runtimeStr TEXT,
    plot TEXT,
    awards TEXT,
    genreList TEXT,
    companies TEXT,
    countries TEXT,
    languages TEXT,
    imDbRating TEXT,
    boxOffice TEXT,
    plotFull TEXT,
	PRIMARY KEY (stt, id)
);
`;

const moviesDirectorQuery = `
CREATE TABLE  IF NOT EXISTS movie_directors (
	id SERIAL,
    movie_id VARCHAR(50),
    director_id VARCHAR(50),
	PRIMARY KEY (id, movie_id)
);
`;

const moviesWriterQuery = `
CREATE TABLE IF NOT EXISTS movie_writers(
	id SERIAL,
	movie_id VARCHAR(50),
    writer_id VARCHAR(50),
	PRIMARY KEY (id, movie_id)
);
`;

const moviesActorQuery = `
CREATE TABLE IF NOT EXISTS movie_actors (
	id SERIAL,
    movie_id VARCHAR(50),
    actor_id VARCHAR(50),
    asCharacter TEXT,
	PRIMARY KEY (id, movie_id)
);
`;

const moviesPosterQuery = `
CREATE TABLE IF NOT EXISTS movie_posters (
	id SERIAL,
    movie_id VARCHAR(50),
    link TEXT,
	language TEXT,
	width INT,
	height INT,
	PRIMARY KEY (id, movie_id)
);
`;

const moviesImageQuery = `
CREATE TABLE IF NOT EXISTS movie_images (
	id SERIAL,
    movie_id VARCHAR(50),
    title TEXT,
    image TEXT,
	PRIMARY KEY (id, movie_id)
);
`;

const moviesSimilarQuery = `
CREATE TABLE IF NOT EXISTS movie_similars (
	id SERIAL,
    movie_id VARCHAR(50),
    similar_movie_id VARCHAR(50),

	PRIMARY KEY (id, movie_id)
);
`;

const namesTableQuery = `
    CREATE TABLE IF NOT EXISTS names (
        id VARCHAR(50) PRIMARY KEY,
        name TEXT,
		role TEXT,
		image TEXT,
		summary TEXT,
		birthDate VARCHAR(10),
		deathDate VARCHAR(10),
		awards TEXT,
		height TEXT
    )
`;

const nameCastMoviesQuery = `
CREATE TABLE IF NOT EXISTS cast_movie_names (
	id SERIAL,
	name_id VARCHAR(50),
    movie_id VARCHAR(50),
    role TEXT,
	PRIMARY KEY (id, name_id)
);
`;

const nameImagesQuery = `
CREATE TABLE IF NOT EXISTS image_names (
	id SERIAL,
	name_id VARCHAR(50),
    title TEXT,
    image TEXT,
	PRIMARY KEY (id, name_id)
);
`;

const reviewsTableQuery = `
CREATE TABLE IF NOT EXISTS reviews (
	id SERIAL,
    movie_id VARCHAR(50),
    username TEXT,
    warningSpoilers BOOLEAN,
    date VARCHAR(20),
    rate TEXT,
    title TEXT,
    content TEXT,
	PRIMARY KEY (id, movie_id)
);
`;

async function insertMovies(db, moviesData) {
	try {
		await db.none(moviesTableQuery);
		await db.none(moviesActorQuery);
		await db.none(moviesWriterQuery);
		await db.none(moviesDirectorQuery);
		await db.none(moviesImageQuery);
		await db.none(moviesPosterQuery);
		await db.none(moviesSimilarQuery);

		for (const movie of moviesData) {
			await db.none(
				`INSERT INTO movies (id, title, originalTitle, fullTitle, year, image, releaseDate, runtimeStr, plot, awards, genreList, companies, countries, languages, imDbRating, boxOffice, plotFull) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
				[
					movie.id,
					movie.title,
					movie.originalTitle,
					movie.fullTitle,
					movie.year,
					movie.image,
					movie.releaseDate,
					movie.runtimeStr,
					movie.plot,
					movie.awards,
					movie.genreList.join(', '),
					movie.companies,
					movie.countries,
					movie.languages,
					movie.imDbRating,
					movie.boxOffice,
					movie.plotFull,
				]
			);

			// Insert directorList into 'movie_directors' table
			for (const directorId of movie.directorList) {
				await db.none(
					`INSERT INTO movie_directors (movie_id, director_id) VALUES ($1, $2)`,
					[movie.id, directorId]
				);
			}

			// Insert actorList into 'movie_actors' table
			for (const actor of movie.actorList) {
				await db.none(
					`INSERT INTO movie_actors (movie_id, actor_id, asCharacter) VALUES ($1, $2, $3)`,
					[movie.id, actor.id, actor.asCharacter]
				);
			}

			// Insert images into 'movie_images' table
			for (const image of movie.images) {
				await db.none(
					`INSERT INTO movie_images (movie_id, title, image) VALUES ($1, $2, $3)`,
					[movie.id, image.title, image.image]
				);
			}

			// Insert posters into 'movie_posters' table
			if (movie.posters && movie.posters.length > 0) {
				for (const poster of movie.posters) {
					await db.none(
						`INSERT INTO movie_posters (movie_id, link, language, width, height) VALUES ($1, $2, $3, $4, $5)`,
						[
							movie.id,
							poster.link,
							poster.language,
							poster.width,
							poster.height,
						]
					);
				}
			}

			// Add similar movies to 'movie_similars' table
			for (const similarId of movie.similars) {
				await db.none(
					`INSERT INTO movie_similars (movie_id, similar_movie_id) VALUES ($1, $2)`,
					[movie.id, similarId]
				);
			}
		}
		console.log('Movies and related data inserted successfully.');
	} catch (error) {
		console.error('Error inserting movies and related data:', error);
	}
}

async function insertNames(db, namesData) {
	try {
		await db.none(namesTableQuery);
		await db.none(nameImagesQuery);
		await db.none(nameCastMoviesQuery);

		for (const name of namesData) {
			await db.none(
				`INSERT INTO names (id, name, role, image, summary, birthDate, deathDate, awards, height) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
				[
					name.id,
					name.name,
					name.role,
					name.image,
					name.summary,
					name.birthDate,
					name.deathDate,
					name.awards,
					name.height,
				]
			);
			// Insert actor movies into 'cast_movie_actors' table
			if (name.castMovies && name.castMovies.length > 0) {
				for (const movie of name.castMovies) {
					await db.none(
						`INSERT INTO cast_movie_names (name_id, movie_id, role) VALUES ($1, $2, $3)`,
						[name.id, movie.id, movie.role]
					);
				}
			}

			// Insert actor images into 'image_actors' table
			if (name.images && name.images.length > 0) {
				for (const image of name.images) {
					await db.none(
						`INSERT INTO image_names (name_id, title, image) VALUES ($1, $2, $3)`,
						[name.id, image.title, image.image]
					);
				}
			}
		}
		console.log('Names and related data inserted successfully.');
	} catch (error) {
		console.error('Error inserting names and related data:', error);
	}
}

async function insertReviews(db, reviewsData) {
	try {
		await db.none(reviewsTableQuery);

		for (const review of reviewsData) {
			for (const item of review.items) {
				await db.none(
					`INSERT INTO reviews (movie_id, username, warningSpoilers, date, rate, title, content) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
					[
						review.movieId,
						item.username,
						item.warningSpoilers,
						item.date,
						item.rate,
						item.title,
						item.content,
					]
				);
			}
		}
		console.log('Reviews and related data inserted successfully.');
	} catch (error) {
		console.error('Error inserting reviews and related data:', error);
	}
}

async function createAndImportDataIfNotExists() {
	try {
		const dbName = process.env.DB_DB;
		const checkDatabaseQuery = `SELECT 1 FROM pg_catalog.pg_database WHERE datname = '${dbName}'`;
		const dbCheckResult = await db.oneOrNone(checkDatabaseQuery);

		const dbExists = dbCheckResult
			? dbCheckResult['?column?'] === 1
			: false;

		if (!dbExists) {
			await db.none(`CREATE DATABASE ${dbName}`);
			console.log(`Database '${dbName}' created successfully.`);
		}

		// IMPORT DATA
		const filePath = './db/data.json';
		const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		const moviesData = jsonData.Movies;
		const namesData = jsonData.Names;
		const reviewsData = jsonData.Reviews;

		await insertNames(db, namesData);
		await insertReviews(db, reviewsData);
		await insertMovies(db, moviesData);

		console.log('Data imported successfully.');

		await db.$pool.end();
	} catch (err) {
		console.error(err);
		throw new Error(
			'Error occurred while creating database or importing data.'
		);
	}
}

module.exports = { db, createAndImportDataIfNotExists };
