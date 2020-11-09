
--create the fk refrence based on the users table and the id column
alter table user_profile 
add column user_id integer references users(id);