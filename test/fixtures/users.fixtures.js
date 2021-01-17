function mockUserData() {
  return [
    {
      name: 'Ryan',
      email: 'mentee@gmail.com',
      is_mentor: false,
      password: 'test',
      join_date: '2020-06-05T00:00:00.000Z',
      open_sessions: 3,
    },
    {
      name: 'Ava',
      email: 'mentor@gmail.com',
      is_mentor: true,
      password: 'test',
      join_date: '2020-04-23T00:00:00.000Z',
      open_sessions: 3,
    },
    {
      name: 'Wilburt Castagnet',
      email: 'test1@gmail.com',
      is_mentor: false,
      password: 'test',
      join_date: '2020-07-14T00:00:00.000Z',
      open_sessions: 3,
    },
  ];
}

function expectedUserData() {
  return [
    {
      name: 'Ryan',
      email: 'mentee@gmail.com',
      is_mentor: false,
      password: 'test',
      join_date: '2020-06-05T00:00:00.000Z',
      open_sessions: 3,
      id: 1,
    },
    {
      name: 'Ava',
      email: 'mentor@gmail.com',
      is_mentor: true,
      password: 'test',
      join_date: '2020-04-23T00:00:00.000Z',
      open_sessions: 3,
      id: 2,
    },
    {
      name: 'Wilburt Castagnet',
      email: 'test1@gmail.com',
      is_mentor: false,
      password: 'test',
      join_date: '2020-07-14T00:00:00.000Z',
      open_sessions: 3,
      id: 3,
    },
  ];
}

module.exports = { mockUserData, expectedUserData };
