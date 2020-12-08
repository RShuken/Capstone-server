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
    return knex
      .from('users as a')
      .join('user_profile as b', 'a.id', 'b.user_id')
      .where('a.id', id)
      .select('*')
      .first();
  },

  deleteUserProfile(knex, id) {
    return knex('user_profile').where({ id }).delete();
  },

  updateUserProfile(knex, id, newUserFields) {
    return knex('user_profile').where({ id }).update(newUserFields);
  },
};

module.exports = UserProfileService;
