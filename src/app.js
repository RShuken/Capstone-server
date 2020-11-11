'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const connectionsRouter = require('./user_connections/user_connections-router');
const userProfileRouter = require('./user_profile/user_profile_router');


const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// standard middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// routes for all CRUD commands to the server
app.use('/api/users', usersRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/user_profile', userProfileRouter);


// default route

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// error handlers
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error, internal error please submit a bug report' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});


module.exports = app;
