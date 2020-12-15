/* eslint-disable strict */
const express = require('express');
const ConnectionsService = require('./user_connections-service');
const xss = require('xss');
const connectionsRouter = express.Router();
const jsonParser = express.json();

const serializeConnection = (connection) => ({
  id: connection.id,
  match_status: connection.match_status,
  connection_message: connection.connection_message,
  user_id: connection.user_id,
  connection_id: connection.connection_id,
  name: connection.name,
  open_sessions: connection.open_sessions,
});

connectionsRouter
  .route('/')
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
