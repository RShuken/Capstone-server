/* eslint-disable strict */


const path = require('path');
const express = require('express');
const xss = require('xss');
const UserProfileService = require('./user_profile_service');

const userProfileRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  profession: user.profession,
  phone: user.phone,
  discord_id: xss(user.discord_id),
  location: xss(user.location),
  time_zone: user.time_zone,
  current_job_title: xss(user.current_job_title),
  current_job_company: xss(user.current_job_company),
  current_job_description: xss(user.current_job_description),
  current_job_start_date: user.current_job_start_date,
  past_job1_title: xss(user.past_job1_title),
  past_job1_company: xss(user.past_job1_company),
  past_job1_description: xss(user.past_job1_description),
  past_job1_start_date: user.past_job1_start_date,
  past_job1_end_date: user.past_job1_end_date,
  past_job2_title: xss(user.past_job2_title),
  past_job2_company: xss(user.past_job2_company),
  past_job2_description: xss(user.past_job2_description),
  past_job2_start_date: user.past_job2_start_date,
  past_job2_end_date: user.past_job2_end_date, 
  user_id: user.user_id
});

userProfileRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserProfileService.getUserProfile(knexInstance)
      .then((users) => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      id,
      profession,
      phone,
      discord_id,
      location,
      time_zone,
      current_job_title,
      current_job_company,
      current_job_description,
      current_job_start_date,
      past_job1_title,
      past_job1_company,
      past_job1_description,
      past_job1_start_date,
      past_job1_end_date,
      past_job2_title,
      past_job2_company,
      past_job2_description,
      past_job2_start_date,
      past_job2_end_date,
      user_id
    } = req.body;
    const newUserProfile = {
      id,
      profession,
      phone,
      discord_id,
      location,
      time_zone,
      current_job_title,
      current_job_company,
      current_job_description,
      current_job_start_date,
      past_job1_title,
      past_job1_company,
      past_job1_description,
      past_job1_start_date,
      past_job1_end_date,
      past_job2_title,
      past_job2_company,
      past_job2_description,
      past_job2_start_date,
      past_job2_end_date,
      user_id
    };

    for (const [key, value] of Object.entries(newUserProfile)) {
      // eslint-disable-next-line
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }


    UserProfileService.insertUserProfile(req.app.get('db'), newUserProfile)
      .then((user) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

userProfileRouter
  .route('/:id')
  .all((req, res, next) => {
    UserProfileService.getById(req.app.get('db'), req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: 'User doesn\'t exist' },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UserProfileService.deleteUserProfile(req.app.get('db'), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      id,
      profession,
      phone,
      discord_id,
      location,
      time_zone,
      current_job_title,
      current_job_company,
      current_job_description,
      current_job_start_date,
      past_job1_title,
      past_job1_company,
      past_job1_description,
      past_job1_start_date,
      past_job1_end_date,
      past_job2_title,
      past_job2_company,
      past_job2_description,
      past_job2_start_date,
      past_job2_end_date,
      user_id
    } = req.body;
    const userToUpdate = {
      id,
      profession,
      phone,
      discord_id,
      location,
      time_zone,
      current_job_title,
      current_job_company,
      current_job_description,
      current_job_start_date,
      past_job1_title,
      past_job1_company,
      past_job1_description,
      past_job1_start_date,
      past_job1_end_date,
      past_job2_title,
      past_job2_company,
      past_job2_description,
      past_job2_start_date,
      past_job2_end_date,
      user_id
    };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body is missing the required fields',
        },
      });

    UserProfileService.updateUserProfile(req.app.get('db'), req.params.id, userToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = userProfileRouter;
