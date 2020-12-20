const express = require('express');
const xss = require('xss');
const publicViewRouter = express.Router();
const PublicServices = require('./public_routes_service');

// this is the public route for fetch request that return a list of mentors to populate the dashboard. 
// here I serialize the results from a sql request that joins two tables and return only the data that is ok to be public. 
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
  job_description: xss(user.job_description)
});

publicViewRouter
  .route('/').get((req, res, next) => {
    const knexInstance = req.app.get('db');
    PublicServices.getAllMentors(knexInstance)
      .then((users) => {
        res.json(users.map(serializeConnection));
      })
      .catch(next);
  });


module.exports = publicViewRouter;
