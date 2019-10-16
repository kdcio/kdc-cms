import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import responseTime from 'response-time';
import routes from './routes/index';
import jwt from './utils/jwt';
import errorHandler from './utils/errorHandler';

// Create a new Express application.
const app = express();

app.use(responseTime());

// secure the app
app.use(helmet());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'local') {
  app.use(logger('combined')); // 'combined' outputs the Apache style LOGs
} else {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup session
if (process.env.NODE_ENV !== 'local') {
  app.set('trust proxy', 1);
}

// Enable CORS
app.use(cors());
app.options('*', cors());

// use JWT auth to secure the api
app.use(jwt());

app.use('/', routes);

// global error handler
app.use(errorHandler);

export default app;
