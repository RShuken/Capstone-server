

const PublicAllMentorsServices = {
  getAllMentors(knex) {
    return knex
      .from('users')
      .join('user_profile', 'users.id', '=', 'user_profile.user_id')
      .select('*');
  },
};

module.exports = PublicAllMentorsServices;
