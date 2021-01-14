# Connectful Server


live app: https://connectful-client.vercel.app/

server: https://afternoon-waters-35759.herokuapp.com/

# Built With

Node
Express
Javascript

# API Documentations

Server BASE URL: https://localhost:8000

`Public Route GET /api/public`
Returns a filtered list of mentors to display on the dashboard page

Example request and response structure:

GET http://localhost:8000/api/public

`response: 200 ok

[
{
"id": 5,
"name": "Eulalie Germain",
"email": "test3@gmail.com",
"is_mentor": true,
"join_date": "2019-11-13T00:00:00.000Z",
"open_sessions": 2,
"profession": "UI UX",
"location": "Timurjaya",
"job_title": "Head of Development",
"job_company": "AMD",
"job_description": "I design beautiful technology in order to make peoples lives better"
},
{
"id": 6,
"name": "Ronnie Sinncock",
"email": "test4@gmail.com",
"is_mentor": true,
"join_date": "2020-05-11T00:00:00.000Z",
"open_sessions": 1,
"profession": "Frontend Development",
"location": "BardaÃ¯",
"job_title": "CTO",
"job_company": "IBM",
"job_description": "I love programming and in my job I get to work with AI and ML tech to build the robots of the future"
},
]`

`POST /login`
Requires the email and password to be passed in the body. This will login a user and verify them with JWT

Example request and response structure:

POST: http://localhost:8000/login

response: 422

`POST /signup`
Requires the name, email, password, is_mentor, and open_sessions to be passed in the body. This will register a new user to the platform.

Example request and response structure:

POST: http://localhost:8000/signup

response: 200 ok

`POST /logout`
This deletes the local cookie and deletes the server session key to log out the user.

Example request and response structure:

POST: http://localhost:8000/logout

response: 200 ok

`GET /api/users`
Returns a filtered array of names of users and their information.

Example request and response structure:

`GET: http://localhost:8000/api/users

response 200 ok

[
{
"id": 1,
"name": "Ryan",
"email": "mentee@gmail.com",
"is_mentor": false,
"password": "test",
"join_date": "2020-06-05T00:00:00.000Z",
"open_sessions": 3
},
{
"id": 2,
"name": "Ava",
"email": "mentor@gmail.com",
"is_mentor": true,
"password": "test",
"join_date": "2020-04-23T00:00:00.000Z",
"open_sessions": 3
},
]`

`POST /api/users`
Adds a person to the user list. Requires the name, email, password, is_mentor, and open_sessions in the body.

Example request and response structure:

POST: http://localhost:8000/api/users

response 201

`GET /api/users/:user_id`
Returns a the user information of the user number passed in the path link.

Example request and response structure:

`GET: http://localhost:8000/api/users/2

response 204

{
"id": 2,
"name": "Ava",
"email": "mentor@gmail.com",
"is_mentor": true,
"password": "test",
"join_date": "2020-04-23T00:00:00.000Z",
"open_sessions": 3
}`

`DELETE /api/users/:user_id`
Deletes the user id in the path link.

Example request and response structure:

`DELETE: http://localhost:8000/api/users/2

response 204

{
"id": 2,
"name": "Ava",
"email": "mentor@gmail.com",
"is_mentor": true,
"password": "test",
"join_date": "2020-04-23T00:00:00.000Z",
"open_sessions": 3
}`

`PATCH /api/users/:user_id`
Updates the user profile number in the path link. This does not require anything in the body, but to update it needs one of the name, password, email, is_mentor, and open_sessions. If a value is present it will be updated.

Example request and response structure:

`PATCH: http://localhost:8000/api/users/2

response 204`

`GET /api/connections`
Returns all user connections based on the user id saved in local session data. Requires the user id to be sent in the session storage.

Example request and response structure:

`GET: http://localhost:8000/api/connections

response 200 ok

[
{
"id": 42,
"match_status": "pending",
"connection_message": "Hello! I'm a student at Thinkful coding bootcamp and I am looking for a mentor to meet with once a week. Do you have time?",
"user_id": 1,
"connection_id": 2,
"name": "Ryan",
"open_sessions": 3
}
]`

`POST /api/connections`
Creates a new connection, requires the match_status, user_id, and connection_id to be passed in the body.

Example request and response structure:

`POST: http://localhost:8000/api/connections

response 201`

`PATCH /api/connections`
Updates a connection with he connection message. Requires the connection_message and the id of the connection to be in the body.

Example request and response structure:

`PATCH: http://localhost:8000/api/connections

response 200 ok

    {
        "id": 42,
        "connection_message": "Hello! I'm a student at Thinkful coding bootcamp and I am looking for a mentor to meet with once a week. Do you have time?",
        "connection_id": 2,
    }`

`GET /api/connections/count`
Returns the number of pending connections for a user. Requires the user id to be saved in local session storage to be accessible.

Example request and response structure:

`POST: http://localhost:8000/api/connections/count

response 200

[
{count: 2}
]`

`GET /api/connections/:connection_id`
Returns the connection based on the id passed in the path link.

Example request and response structure:

`GET: http://localhost:8000/api/connections/2

response 200 ok

    {
        "id": 42,
        "connection_message": "Hello! I'm a student at Thinkful coding bootcamp and I am looking for a mentor to meet with once a week. Do you have time?",
        "connection_id": 2,
    }`

`PATCH /api/connections/:connection_id`
Updates the match status of the connection id sent in the path link. Requires a match_status to be passed in the body and it can only take these values: 'pending', 'accepted' or 'denied'

Example request and response structure:

`PATCH: http://localhost:8000/api/connections/2

response 204

{
"match_status": 'pending'
}`

`GET /api/user_profile`
Returns all user profile information on the server. 

Example request and response structure:

`GET: http://localhost:8000/api/user_profile

response 200 ok

[
    {
        "id": 1,
        "profession": "Backend Development",
        "phone": "451-755-8850",
        "discord_id": "Fundamental",
        "location": "SÃ¶dra Sandby",
        "job_title": "UI Lead",
        "job_company": "AMD",
        "job_description": "I love programming and in my job I get to work with AI and ML tech to build the robots of the future",
        "user_id": 1
    },
    {
        "id": 3,
        "profession": "Backend Development",
        "phone": "382-170-3814",
        "discord_id": "Managed",
        "location": "Pellegrini",
        "job_title": "Dev Ops Director",
        "job_company": "IBM",
        "job_description": "I run highly skilled teams of developers to break new ground using cutting edge technology",
        "user_id": 3
    }
]`

`POST /api/user_profile`
Adds a new user profile to the database, it requires the id, profession, phone, discord_id, location, job_title, job_company job_description, and user_id to be in the body. 

Example request and response structure:

`POST: http://localhost:8000/api/connections/2

response 201
items in body:
{
      id,
      profession,
      phone,
      discord_id,
      location,
      job_title,
      job_company,
      job_description,
      user_id,
}`

`GET /api/user_profile/profile`
Returns returns the user profile based on the user id saved in the local session data. Requires a user id to be saved in local session.

Example request and response structure:

`GET: http://localhost:8000/api/user_profile/profile

response 200 ok

[
    {
        "id": 1,
        "profession": "Backend Development",
        "phone": "451-755-8850",
        "discord_id": "Fundamental",
        "location": "SÃ¶dra Sandby",
        "job_title": "UI Lead",
        "job_company": "AMD",
        "job_description": "I love programming and in my job I get to work with AI and ML tech to build the robots of the future",
        "user_id": 1
    }
]`

`GET /api/user_profile/:id`
Returns all the user profile based on the id added to the end of the path link.

Example request and response structure:

`GET: http://localhost:8000/api/user_profile/2

response 200 ok

[
    {
        "id": 1,
        "profession": "Backend Development",
        "phone": "451-755-8850",
        "discord_id": "Fundamental",
        "location": "SÃ¶dra Sandby",
        "job_title": "UI Lead",
        "job_company": "AMD",
        "job_description": "I love programming and in my job I get to work with AI and ML tech to build the robots of the future",
        "user_id": 1
    }
]`

`DELETE /api/user_profile/:id`
Deletes the user added to the end of the path link. 

Example request and response structure:

`DELETE: http://localhost:8000/api/user_profile/2

response 204
`
`PATCH /api/user_profile/:id`
Updates the user profile based on the id passed through the path link. Requires the id, profession, phone, discord_id, location, job_title, job_company job_description, and user_id to be in the body. 

Example request and response structure:

`PATCH: http://localhost:8000/api/user_profile/2

response 204
Example body:
{
      id,
      profession,
      phone,
      discord_id,
      location,
      job_title,
      job_company,
      job_description,
      user_id,
    }
`


## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin connectful
createdb -U dunder-mifflin connectful-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env TEST_DATABASE_URL=connectful-test npm run migrate
```

And `npm test` should work at this point


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
