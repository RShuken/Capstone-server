const ConnectionsService = {
  getAllConnections(knex, user_id) {
    return knex.select('*').where('user_id', user_id).from('user_connections');
  },
  insertConnection(knex, newConnection) {
    return knex
      .insert(newConnection)
      .into('user_connections')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  updateConnection(knex, connection_request_id, status) {
    return knex('user_connections')
      .update('connection_status', status)
      .where('id', connection_request_id)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getAllConnectionRequestsWithProfileInfoById(knex, id) {
    return knex
      .from('user_connections as a')
      .join('users as b', 'b.id', '=', 'a.user_id')
      .where('a.connection_id', id)
      .where('a.match_status', 'pending')
      .select('a.id','a.match_status','a.connection_message','a.user_id','a.connection_id','b.name','b.open_sessions');
  },
  getAllConnectionsPendingById(knex, id) {
    return knex
      .from('user_connections as a')
      .where('a.match_status', 'pending')
      .where('connection_id', id)
      .count();
  },
  getById(knex, id) {
    return knex
      .from('user_connections as a')
      .join('users as b', 'b.id', '=', 'a.user_id')
      .join('user_profile as c', 'b.id', '=', 'c.user_id')
      .select('*')
      .where('a.connection_id', id)
      .first();
  },
  deleteConnection(knex, id) {
    return knex('user_connections').where({ id }).delete();
  },
  newUpdateConnection(knex, id, newConnectionFields) {
    console.log('this is the id and the message', id, newConnectionFields)
    return knex('user_connections')
      .where('id', id)
      .update('connection_message', newConnectionFields)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ConnectionsService;
