
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (1, true, false, '1', 1, 1);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (2, true, true, '2', 2, 2);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (3, false, true, '3', 3, 3);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (4, true, true, '4', 4, 4);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (5, false, true, '5', 5, 5);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (6, false, true, '5', 6, 6);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (7, true, true, '3', 7, 7);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (8, false, true, '2', 8, 8);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (9, true, false, '3', 9, 9);
insert into user_connections (id, blocked, flagged, rating, user_id, connection_id) values (10, true, true, '1', 10, 10);


-- to seed run
-- psql -U ryan -d connectful -f ./seeds/seed.connectful_user_connections.sql

