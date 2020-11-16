/* eslint-disable strict */

const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("users").select("*").where("id", id).first();
  },

  getByEmail(knex, email) {
    return knex.from("users").select("*").where("email", email).first();
  },

  deleteUser(knex, id) {
    return knex("users").where({ id }).delete();
  },

  updateUser(knex, id, newUserFields) {
    return knex("users").where({ id }).update(newUserFields);
  },

  getUserAndProfile(knex) {
    return knex("users").join(
      "user_profile",
      "users.id",
      "=",
      "user_profile.user_id"
    );
  },
};

module.exports = UsersService;
