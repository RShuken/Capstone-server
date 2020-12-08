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
    console.log('this is the req.body ',req.body)
    const { connection_message, id } = req.body;
    ConnectionsService.newUpdateConnection(
      req.app.get('db'),
      id,
      connection_message.connection_message
    )
      .then((connection) => {
        res.status(204).end();
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
    ConnectionsService.newUpdateConnection(
      req.app.get('db'),
      req.params.connection_id,
      {
        match_status,
      }
    )
      .then((connection) => {
        res.json(connection);
      })
      .catch(next);
  });

module.exports = connectionsRouter;
