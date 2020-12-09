
insert into user_connections (user_id, connection_id, match_status, connection_message) values (1, 2, 'pending', 'please connect with me');
insert into user_connections (user_id, connection_id, match_status, connection_message) values (2, 1, 'pending', 'please connect with me');
insert into user_connections (user_id, connection_id, match_status, connection_message) values (3, 1, 'pending', 'please connect with me');
insert into user_connections (user_id, connection_id, match_status, connection_message) values (4, 1, 'pending', 'please connect with me');
insert into user_connections (user_id, connection_id, match_status) values (5, 2, 'accepted');
insert into user_connections (user_id, connection_id, match_status) values (6, 2, 'accepted');
insert into user_connections (user_id, connection_id, match_status) values (7, 1, 'accepted');
insert into user_connections (user_id, connection_id, match_status) values (8, 2, 'denied');
insert into user_connections (user_id, connection_id, match_status) values (9, 2, 'denied');
insert into user_connections (user_id, connection_id, match_status) values (10, 1, 'denied');


-- to seed run
-- psql -U ryan -d connectful -f ./seeds/seed.connectful_user_connections.sql

