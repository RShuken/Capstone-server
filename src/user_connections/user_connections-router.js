/* eslint-disable strict */
const express = require("express");
const ConnectionsService = require("./user_connections-service");
const xss = require("xss");
const connectionsRouter = express.Router();
const jsonParser = express.json();

const serializeConnection = (connection) => ({
  blocked: connection.blocked,
  flagged: connection.flagged,
  user_id: connection.user_id,
  connection_id: connection.connection_id,
  rating: connection.rating,
});

connectionsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ConnectionsService.getAllConnections(knexInstance, req.session.user.id)
      .then((users) => {
        res.json(users.map(serializeConnection));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { blocked, flagged, user_id, connection_id, rating } = req.body;
    const newConnection = { blocked, flagged, user_id, connection_id, rating };
    ConnectionsService.insertConnection(req.app.get("db"), newConnection)
      .then((connection) => {
        res
          .status(201)
          .location(`/connections/${connection.user_id}`)
          .json(connection);
      })
      .catch(next);
  });

connectionsRouter.route("/:connection_id").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  ConnectionsService.getById(knexInstance, req.params.connection_id)
    .then((connection) => {
      if (!connection) {
        return res.status(404).json({
          error: { message: "Connection doesn't exist" },
        });
      }
      res.json(connection);
    })
    .catch(next);
});

module.exports = connectionsRouter;
