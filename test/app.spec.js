const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const { mockUserData } = require('./fixtures/users.fixtures');

describe('App', () => {
  let db;
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
  after('drop connection to db', () => {
    db.raw(
      'TRUNCATE users, user_profile, user_connections RESTART IDENTITY CASCADE;'
    );
    db.destroy();
  });
  // clear the tables after each test
  afterEach('Clear tables', () =>
    db.raw(
      'TRUNCATE users, user_profile, user_connections RESTART IDENTITY CASCADE;'
    )
  );

  // test the default route
  it('GET / responds with 200 containing "Hello, world!"', () => {
    supertest(app).get('/').expect(200, 'Hello, world!');
  });

  //test the login request and expect a 200
  it('POST /login responds with 200 and the user information', async () => {
    await db.into('users').insert(testUsers);
    supertest(app)
      .post('/login')
      .send({ email: testUsers[0].email, password: testUsers[0].password })
      .expect(200);
  });

  it('POST /signup mentor signup responds with 200 and the new user information', async () => {
    const newAccount = {
      email: 'testMentor@gmail.com',
      password: 'test',
      name: 'ava',
      is_mentor: true,
      open_sessions: 3,
    };
    await db.into('users').insert();
    supertest(app).post('/signup').send(newAccount).expect(200);
  });

  it('POST /signup mentee signup responds with 200 and the new user information', async () => {
    const newAccount = {
      email: 'testMentee@gmail.com',
      password: 'test',
      name: 'ryan',
      is_mentor: false,
      open_sessions: 3,
    };
    await db.into('users').insert();
    supertest(app).post('/signup').send(newAccount).expect(200);
  });

  it('POST /logout delete the user cookies and the session data', () => {
    supertest(app).post('/logout').send({}).expect(200);
  });
});
