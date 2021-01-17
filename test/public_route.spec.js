const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const { expectedPublicRouteData } = require('./fixtures/public_route.fixtures');
const { mockUserProfileData } = require('./fixtures/user_profile.fixtures');
const { mockUserData } = require('./fixtures/users.fixtures');

describe('App Public Route', () => {
  let db;
  let currentUser;
  // fixture goes here
  const mockUsers = mockUserData();
  const mockProfiles = mockUserProfileData();
  const expectedData = expectedPublicRouteData();

  // create initial connection with the database
  before('Create knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  //after the connection is set with the DB lets now make sure the DB is clear
  after('drop connection to db', async () => {
    await db.raw(
      'TRUNCATE users, user_profile, user_connections RESTART IDENTITY CASCADE;'
    );
    db.destroy();
  });

  beforeEach((done) => {
    db.into('users')
      .insert(mockUsers)
      .then(async () => {
        await db.into('user_profile').insert(mockProfiles);
        done();
      });
  });

  // clear the tables after each test
  afterEach('Clear tables', async () => {
    await db.raw(
      'TRUNCATE users, user_profile, user_connections RESTART IDENTITY CASCADE;'
    );
  });

  // test the default route
  it('GET /api/public returns an array of users', () => {
    return supertest(app).get('/api/public').expect(200).expect(expectedData);
  });
});
