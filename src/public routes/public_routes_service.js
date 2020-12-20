
// this service joins the 'users' and the 'user_profile' tables then returns all where 'is_mentor' is true. 
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
