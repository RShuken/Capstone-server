const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const { mockUserData } = require('./fixtures/users.fixtures');
const {
  mockUserProfileData,
  expectedUserProfileData,
} = require('./fixtures/user_profile.fixtures');
// main describe test for all user profile calls
describe('App user profile table fetch test', () => {
  // declare the db
  let db;
  // declare the current user
  let currentUser;
  // fixture goes here
  const testUsers = mockUserData();
  const testUserProfiles = mockUserProfileData();
  const expectedUserProfile = expectedUserProfileData();

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
  // insert mock data into the users and user_profile tables
  beforeEach((done) => {
    db.into('users')
      .insert(testUsers)
      .then(async () => {
        await db.into('user_profile').insert(testUserProfiles);
        supertest(app)
          .post('/login')
          .send({
            email: testUsers[0].email,
            password: testUsers[0].password,
          })
          .end((err, rsp) => {
            currentUser = rsp.body;
            done();
          });
      });
  });
  // clear the tables after each test
  afterEach('Clear tables', async () => {
    await db.raw(
      'TRUNCATE users, user_profile, user_connections RESTART IDENTITY CASCADE;'
    );
  });
  // authentication sad path test
  it('GET /api/user_connections returns 403 error if auth token is missing', () => {
    return supertest(app).get('/api/user_profile/profile').expect(403);
  });

  // test the default route get user profile data
  it('GET /api/user_profile/profile returns the users profile', () => {
    return supertest(app)
      .get('/api/user_profile/profile')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .expect(200)
      .expect(expectedUserProfile);
  });
  // patch user profile by id happy path test
  it('PATCH /api/user_profile/:id returns a 204 when patching to the user profile table by id', () => {
    const mockUserProfile = {
      name: 'Ryan',
      open_sessions: 3,
      id: 1,
      profession: 'Backend Development',
      phone: '451-755-8850',
      discord_id: 'Fundamental',
      location: 'Denver',
      job_title: 'UI Lead',
      job_company: 'AMD',
      job_description:
        'I love programming and in my job I get to work with AI and ML tech to build the robots of the future',
      user_id: 1,
    };
    return supertest(app)
      .patch('/api/user_profile/1')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockUserProfile)
      .expect(204);
  });
  //patch user profile by id sad path test
  it('PATCH /api/user_profile/:id returns, 204 no content, when fields are missing', () => {
    const mockUserProfile = {
      id: 1,
      job_title: 'test',
      job_company: 'test',
      job_description: 'test',
      user_id: 1,
    };
    return supertest(app)
      .patch('/api/user_profile/1')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockUserProfile)
      .expect(204);
  });
});
