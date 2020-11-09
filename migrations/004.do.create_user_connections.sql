

--drop tables to make sure the tables will be clean
drop table if exists user_connections;

--declare the ENUM values for profession
create type rating as ENUM (1, 2, 3, 4, 5);


--create the project table that is the most independent table
create table user_connections (
    blocked boolean default 'false',
    flagged boolean default 'false',
    rating rating
);
