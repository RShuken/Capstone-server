'use strict';

const PublicServices = {
  getAllMentors(knex) {
    return knex
      .from('users')
      .where('is_mentor', true)
      .join('user_profile', 'users.id', '=', 'user_profile.user_id')
      .select('*');
  },
};

module.exports = PublicServices;
