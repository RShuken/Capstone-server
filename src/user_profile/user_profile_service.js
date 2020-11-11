/* eslint-disable strict */



const UserProfileService = {
  getUserProfile(knex) {
    return knex.select('*').from('user_profile');
  },

  insertUserProfile(knex, newUser) {
    return knex
      .insert(newUser)
      .into('user_profile')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from('user_profile').select('*').where('id', id).first();
  },

  deleteUserProfile(knex, id) {
    return knex('user_profile').where({ id }).delete();
  },

  updateUserProfile(knex, id, newUserFields) {
    return knex('user_profile').where({ id }).update(newUserFields);
  },
};

module.exports = UserProfileService;
