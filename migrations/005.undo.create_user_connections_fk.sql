
-- remove the FK column
alter table if exists user_connections 
drop column user_id;


-- remove the FK column
alter table if exists user_connections 
drop column connection_id;