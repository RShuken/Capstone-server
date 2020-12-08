/* eslint-disable strict */
const express = require('express');
const xss = require('xss');
const publicAllMentorsViewRouter = express.Router();
const PublicAllMentorsServices = require('./public_all_mentors_service');

const serializeConnection = (user) => ({
  id: user.id,
  name: xss(user.name),
  email: xss(user.email),
  is_mentor: user.is_mentor,
  join_date: user.join_date,
  open_sessions: user.open_sessions,
  profession: user.profession,
  location: xss(user.location),
  job_title: xss(user.job_title),
  job_company: xss(user.job_company),
  job_description: xss(user.job_description),
  phone: user.phone,
  discord_id: xss(user.discord_id),
  user_id: user.user_id,
});

publicAllMentorsViewRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  PublicAllMentorsServices.getAllMentors(knexInstance)
    .then((users) => {
      res.json(users.map(serializeConnection));
    })
    .catch(next);
});

module.exports = publicAllMentorsViewRouter;
