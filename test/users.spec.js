const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const { mockUserData, expectedUserData } = require('./fixtures/users.fixtures');

describe('App', () => {
  let db;
  let currentUser;
  // fixture goes here
  const testUsers = mockUserData();
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
      .insert(testUsers)
      .then(() => {
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

  it('GET /api/users returns 403 error if auth token is missing', () => {
    return supertest(app).get('/api/users').expect(403);
  });

  // test the default route
  it('GET /api/users returns an array of users', () => {
    return supertest(app)
      .get('/api/users')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .expect(200)
      .expect(expectedUserData());
  });

  it('POST /api/users add a user to the users table and returns the user data and returns a 200', () => {
    const newUser = testUsers[0];
    const expectedUser = {
      name: 'Ryan',
      email: 'mentee@gmail.com',
      is_mentor: false,
      password: 'test',
      join_date: '2020-06-05T00:00:00.000Z',
      open_sessions: 3,
    };
    return supertest(app)
      .post('/api/users')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(newUser)
      .expect(201)
      .expect((res) => {
        res.body.name = expectedUser.name;
        res.body.email = expectedUser.email;
        res.body.is_mentor = expectedUser.is_mentor;
        res.body.join_date = expectedUser.join_date;
        res.body.open_sessions = expectedUser.open_sessions;
      });
  });

  it('POST /api/users returns a 400 and an error when the user data is corrupt', () => {
    const newUser = testUsers[0];
    delete newUser.name;
    delete newUser.email;
    return supertest(app)
      .post('/api/users')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(newUser)
      .expect(400);
  });
});
