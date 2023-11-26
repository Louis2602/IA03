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

const indexRoutes = require('./routes/index.route');
const movieRoutes = require('./routes/movie.route');
const reviewRoutes = require('./routes/review.route');
const actorRoutes = require('./routes/actor.route');
const adminRoutes = require('./routes/admin.route');
const searchRoutes = require('./routes/search.route');

app.use('/', indexRoutes);
app.use('/movies', movieRoutes);
app.use('/reviews', reviewRoutes);
app.use('/actors', actorRoutes);
app.use('/admin', adminRoutes);
app.use('/search', searchRoutes);

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
