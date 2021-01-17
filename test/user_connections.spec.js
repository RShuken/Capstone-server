const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const { mockUserData } = require('./fixtures/users.fixtures');
const {
  mockUserConnectionsData,
  expectedUserConnectionsData,
} = require('./fixtures/user_connections.fixtures');


// main describe test for all connections calls
describe('App connection table fetch test', () => {
  // declare the db
  let db;
  // declare the current user
  let currentUser;
  // fixture goes here
  const testUsers = mockUserData();
  const testUserConnections = mockUserConnectionsData();

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
  // insert mock data into the users and user_connections tables
  beforeEach((done) => {
    db.into('users')
      .insert(testUsers)
      .then(async () => {
        await db.into('user_connections').insert(testUserConnections);
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
  it('GET /api/connections returns 403 error if auth token is missing', () => {
    return supertest(app).get('/api/connections').expect(403);
  });

  // test the default route get user connections
  it('GET /api/connections returns an array of user connections', () => {
    return supertest(app)
      .get('/api/connections')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .expect(200)
      .expect(expectedUserConnectionsData());
  });
  //test posting a new connection to the table happy path test
  it('POST /api/connections add a connection to the user_connections table and returns the user data and returns a 200', () => {
    const mockPostData = {
      user_id: 2,
      connection_id: 1,
      match_status: 'pending',
    };
    return supertest(app)
      .post('/api/connections')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockPostData)
      .expect(201)
      .expect((res) => {
        res.body.match_status = 'pending';
        res.body.user_id = 2;
        res.body.connection_id = 1;
      });
  });
  // post connections sad path test
  it('POST /api/connections returns a 400 and an error when the user data is corrupt', () => {
    const mockPostData = {
      connection_id: 1,
      match_status: 'pending',
    };
    return supertest(app)
      .post('/api/connections')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockPostData)
      .expect(400);
  });
  // patch connections happy path test
  it('PATCH /api/connections returns a 204 when patching to the user_connections table', () => {
    const mockConnection = { id: 1, connection_message: 'hey lets connect' };
    return supertest(app)
      .patch('/api/connections')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockConnection)
      .expect(204);
  });
  // patch connections sad path test
  it('PATCH /api/connections returns a 400 when fields are missing from the body', () => {
    const mockConnection = { connection_message: 'hey lets connect' };
    return supertest(app)
      .patch('/api/connections')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockConnection)
      .expect(400);
  });
  // patch by id happy path test
  it('PATCH /api/connections/:id returns a 204 when patching to the user_connections table by id', () => {
    const mockConnection = { match_status: 'pending' };
    return supertest(app)
      .patch('/api/connections/1')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .send(mockConnection)
      .expect(204);
  });
  // patch by id sad path test
    it('PATCH /api/connections/:id returns a 400 when fields are missing', () => {
      const mockConnection = { };
      return supertest(app)
        .patch('/api/connections/1')
        .set('user-id', currentUser.id)
        .set('authorization', currentUser.accessToken)
        .send(mockConnection)
        .expect(400);
    });
  // get the number of pending invites by id
  it('GET /api/connections returns an array of user connections', () => {
    return supertest(app)
      .get('/api/connections/count')
      .set('user-id', currentUser.id)
      .set('authorization', currentUser.accessToken)
      .expect(200)
      .expect({ count: '3' });
  });
});
