const express = require('express');
const ConnectionsService = require('./user_connections-service');
const xss = require('xss');
const connectionsRouter = express.Router();
const jsonParser = express.json();

// this is the user_connections router and handles when a connection is requested, created or updated. I serialize the response based on joining the 'user' table and the 'user_connections' table, and use XSS to prevent injections where user input is allowed. The other connection fields all happen by default and have expected values in the database. 
const serializeConnection = (connection) => ({
  id: connection.id,
  match_status: connection.match_status,
  connection_message: xss(connection.connection_message),
  user_id: connection.user_id,
  connection_id: connection.connection_id,
  name: xss(connection.name),
  open_sessions: connection.open_sessions,
});

connectionsRouter
  .route('/')
  // simple get request to return a list of all connections based on the user id. 
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ConnectionsService.getAllConnectionRequestsWithProfileInfoById(
      knexInstance,
      req.session.user.id
    )
      .then((users) => {
        res.json(users.map(serializeConnection));
      })
      .catch(next);
  })
  // this post creates a new user connection, and the default status is always 'pending'. I do not update the connection message here but instead to it in a patch request later. This simply creates the connection once the use clicks the button.
  .post(jsonParser, (req, res, next) => {
    const { match_status, user_id, connection_id } = req.body;
    const newConnection = {
      match_status,
      user_id,
      connection_id,
    };
    // this loops through the request data and throws an error if something is missing.
    for (const [key, value] of Object.entries(newConnection)) {
      if (!value && typeof value !== 'boolean') {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    const connectionToUpdate = { match_status, user_id, connection_id };
    const numberOfValues = Object.values(connectionToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body is missing the required fields',
        },
      });
    ConnectionsService.insertConnection(req.app.get('db'), newConnection)
      .then((connection) => {
        res
          .status(201)
          .location(`/connections/${connection.user_id}`)
          .json(connection);
      })
      .catch(next);
  })
  // this patch request is what I use to update the connection message that is sent to the corresponding user. I use this when a user finishes writing the connection message. I know I could have made the post request do this but I wanted to learn and be able to do a patch request as well as a post. 
  .patch(jsonParser, (req, res, next) => {
    const { connection_message, id } = req.body;
    const newConnectionMessage = {
      connection_message: connection_message, id: id
    };
    // this loops through the request data and throws an error if something is missing.
    for (const [key, value] of Object.entries(newConnectionMessage)) {
      if (!value && typeof value !== 'boolean') {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    ConnectionsService.newUpdateConnection(
      req.app.get('db'),
      id,
      connection_message
    )
      .then((connection) => {
        res.status(204).end();
      })
      .catch(next);
  });
// this the request that returns the number of 'pending' request based on the user_connections table.
connectionsRouter.route('/count').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  ConnectionsService.getCountAllConnectionsPendingById(
    knexInstance,
    req.session.user.id
  )
    .then((data) => {
      res.status(200)
      res.json(data[0]);
    })
    .catch(next);
});

connectionsRouter
  .route('/:connection_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ConnectionsService.getById(knexInstance, req.params.connection_id)
      .then((connection) => {
        if (!connection) {
          return res.status(404).json({
            error: { message: 'Connection does not exist' },
          });
        }
        res.json(connection);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { match_status } = req.body;
    const newMatch = { match_status: match_status}
    for (const [key, value] of Object.entries(newMatch)) {
      if (!value && typeof value !== 'boolean') {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    ConnectionsService.newUpdateStatusConnection(
      req.app.get('db'),
      req.params.connection_id,
      match_status
    )
      .then((connection) => {
        res.status(204)
        res.json(connection);
      })
      .catch(next);
  });

module.exports = connectionsRouter;
