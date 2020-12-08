/* eslint-disable strict */

const path = require('path');
const express = require('express');
const xss = require('xss');
const UserProfileService = require('./user_profile_service');

const userProfileRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  name: user.name,
  open_sessions: user.open_sessions,
  id: user.id,
  profession: user.profession,
  phone: user.phone,
  discord_id: xss(user.discord_id),
  location: xss(user.location),
  job_title: xss(user.job_title),
  job_company: xss(user.job_company),
  job_description: xss(user.job_description),
  user_id: user.user_id,
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
      job_title,
      job_company,
      job_description,
      user_id,
    } = req.body;
    const newUserProfile = {
      id,
      profession,
      phone,
      discord_id,
      location,
      job_title,
      job_company,
      job_description,
      user_id,
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

userProfileRouter.get('/profile', (req, res, next) => {
  UserProfileService.getById(req.app.get('db'), req.session.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: { message: 'User does not exist' },
        });
      }

      res.json(serializeUser(user));
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
            error: { message: 'User does not exist' },
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
      job_title,
      job_company,
      job_description,
      user_id,
    } = req.body;
    const userToUpdate = {
      id,
      profession,
      phone,
      discord_id,
      location,
      job_title,
      job_company,
      job_description,
      user_id,
    };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body is missing the required fields',
        },
      });

    UserProfileService.updateUserProfile(
      req.app.get('db'),
      req.params.id,
      userToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = userProfileRouter;
