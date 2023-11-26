require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const TemplateEngine = require('./21337');

const bodyParser = require('body-parser');
const { initializeDb } = require('./db');
const CustomError = require('./modules/custom_err');

const app = express();
const port = process.env.PORT || 21337;
const localhost = process.env.HOST;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.engine('html', TemplateEngine.render);
app.set('views', './views');
app.set('view engine', 'html');

const MovieController = require('./controllers/movie.controller');
app.get('/', async (req, res) => {
	try {
		await initializeDb();
		const top5Movies = await MovieController.getTop5Rating(req, res);
		// const topboxoffice = await MovieController.getTopBoxOffice(req, res);

		res.render('index', { top5Movies });
	} catch (err) {
		console.error(err);
	}
});

const movieRoutes = require('./routes/movie.route');
const reviewRoutes = require('./routes/review.route');
app.use('/', movieRoutes);
app.use('/', reviewRoutes);

// Handling invalid routes
app.use((req, res, next) => {
	res.status(404).render('error', {
		code: 404,
		msg: 'Page not found',
		description: 'The page you’re looking for doesn’t exist.',
	});
});

// Handling custom errors
app.use((err, req, res, next) => {
	const statusCode = err instanceof CustomError ? err.statusCode : 500;
	res.status(statusCode).render('error', {
		code: statusCode,
		msg: 'Server error',
		description: err.message,
	});
});

app.listen(port, () => {
	console.log(`Server is running on: http://${localhost}:${port}`);
});
