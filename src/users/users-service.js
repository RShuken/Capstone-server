/* eslint-disable strict */

const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('users');
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then((rows) => {
        return rows[0];
      })
      .then((user) => {
        let tempProfile = {
          profession: 'UI UX',
          phone: '555-555-5555',
          discord_id: 'please update',
          location: 'please update',
          job_title: 'please update',
          job_company: 'please update',
          job_description: 'please update',
          user_id: user.id,
        };

        return knex

          .insert(tempProfile)
          .into('user_profile')
          .returning('*')
          .then((rows) => {
            return user;
          });
      });
  },

  getById(knex, id) {
    return knex.from('users').select('*').where('id', id).first();
  },

  getByEmail(knex, email) {
    return knex.from('users').select('*').where('email', email).first();
  },

  deleteUser(knex, id) {
    return knex('users').where({ id }).delete();
  },

  updateUser(knex, id, newUserFields) {
    return knex('users').where({ id }).update(newUserFields);
  },

  getUserAndProfile(knex) {
    return knex('users').join(
      'user_profile',
      'users.id',
      '=',
      'user_profile.user_id'
    );
  },
};

module.exports = UsersService;
