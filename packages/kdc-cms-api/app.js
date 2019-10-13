const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const responseTime = require('response-time');
const jwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

// Create a new Express application.
const app = express();

app.use(responseTime());

// secure the app
app.use(helmet());

// don't show the log when it is test
if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined')); // 'combined' outputs the Apache style LOGs
} else if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup session
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Enable CORS
app.use(cors());
app.options('*', cors());

// use JWT auth to secure the api
app.use(jwt());

// Import Routes
const routes = require('./routes/index');

app.use('/', routes);

// global error handler
app.use(errorHandler);

module.exports = app;
