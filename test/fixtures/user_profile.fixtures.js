function mockUserProfileData() {
  return [
    {
      profession: 'Backend Development',
      phone: '451-755-8850',
      discord_id: 'Fundamental',
      location: 'Denver',
      job_title: 'UI Lead',
      job_company: 'AMD',
      job_description:
        'I love programming and in my job I get to work with AI and ML tech to build the robots of the future',
      user_id: 1,
    },
    {
      profession: 'Fullstack Development',
      phone: '692-417-6618',
      discord_id: '24/7',
      location: 'Paombong',
      job_title: 'Head of Development',
      job_company: 'Nvidia',
      job_description:
        'I design beautiful technology in order to make peoples lives better',
      user_id: 2,
    },
    {
      profession: 'Backend Development',
      phone: '382-170-3814',
      discord_id: 'Managed',
      location: 'Pellegrini',
      job_title: 'Dev Ops Director',
      job_company: 'IBM',
      job_description:
        'I run highly skilled teams of developers to break new ground using cutting edge technology',
      user_id: 3,
    },
  ];
}

function expectedUserProfileData() {
  return {
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
}

module.exports = { mockUserProfileData, expectedUserProfileData };
