"use strict";

const ConnectionsService = {
  getAllConnections(knex, user_id) {
    return knex.select("*").where("user_id", user_id).from("user_connections");
  },
  insertConnection(knex, newConnection) {
    return knex
      .insert(newConnection)
      .into("user_connections")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("user_connections")
      .select("*")
      .where("connection_id", id)
      .first();
  },
  deleteConnection(knex, id) {
    return knex("user_connections").where({ id }).delete();
  },
  updateConnection(knex, id, newConnectionFields) {
    return knex("user_connections").where({ id }).update(newConnectionFields);
  },
};

module.exports = ConnectionsService;
