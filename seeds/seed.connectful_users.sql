

insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Ryan', 'mentee@gmail.com', false, 'test', '6/5/2020', 3);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Ava', 'mentor@gmail.com', true, 'test', '4/23/2020', 3);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Wilburt Castagnet', 'test1@gmail.com', false, 'test', '7/14/2020', 3);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Maiga Rountree', 'test2@gmail.com', false, 'test', '11/15/2019', 1);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Eulalie Germain', 'test3@gmail.com', true, 'test', '11/13/2019', 2);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Ronnie Sinncock', 'test4@gmail.com', true, 'test', '5/11/2020', 1);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Duff Adamczewski', 'test5@gmail.com', true, 'test', '7/10/2020', 2);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Brennen Sone', 'test6@gmail.com', true, 'test', '7/12/2020', 2);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Louisette Mauvin', 'test7@gmail.com', true, 'test', '3/29/2020', 3);
insert into users (name, email, is_mentor, password, join_date, open_sessions) values ('Berget Imloch', 'test8@gmail.com', false, 'test', '2/22/2020', 3);


-- to seed run
-- psql -U ryan -d connectful -f ./seeds/seed.connectful_users.sql