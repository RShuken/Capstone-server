
--create the fk refrence based on the users table and the id column that represents the user id
alter table user_connections 
add column user_id integer references users(id)
on delete cascade not null;

--create the fk refernce based on the users table and the id colum that will represent the connection id
alter table user_connections 
add column connection_id integer references users(id)
on delete cascade not null;




