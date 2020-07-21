const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const userRouter = require('./routes/userRoutes');
const helmet = require('helmet');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const config = require('./server/configure');
const app = express();
config(app); // Lawrence Aang: Include the routes during app configuration in configure.js
app.use(helmet());
app.use(
	cors({
		credentials: true,
	})
);
app.options('*', cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));
app.use(express.static('static'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(bodyParser.json());
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//set up routes
app.use('/api/users', userRouter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  
  next();
});

app.use(globalErrorHandler);
module.exports = app;
