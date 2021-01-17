function expectedUserConnectionsData() {
  return [
    {
      id: 1,
      match_status: 'pending',
      connection_message: 'please connect with me',
      user_id: 1,
      connection_id: 1,
      name: 'Ryan',
      open_sessions: 3,
    },
    {
      id: 2,
      match_status: 'pending',
      connection_message: 'please connect with me',
      user_id: 1,
      connection_id: 1,
      name: 'Ryan',
      open_sessions: 3,
    },
    {
      id: 3,
      match_status: 'pending',
      connection_message: 'please connect with me',
      user_id: 1,
      connection_id: 1,
      name: 'Ryan',
      open_sessions: 3,
    },
  ];
}

function mockUserConnectionsData() {
  return [
    {
      match_status: 'pending',
      connection_message: 'please connect with me',
      user_id: 1,
      connection_id: 1,
    },
    {
      match_status: 'pending',
      connection_message: 'please connect with me',
      user_id: 1,
      connection_id: 1,
    },
    {
      match_status: 'pending',
      connection_message: 'please connect with me',
      user_id: 1,
      connection_id: 1,
    },
  ];
}

module.exports = { expectedUserConnectionsData, mockUserConnectionsData };
