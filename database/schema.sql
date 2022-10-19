-- when first creating database:
-- start up psql in CLI by typing 'psql postgres'
-- create database by typing 'CREATE DATABASE yewomi;'
-- quit database with '\q'

-- on each refresh of db, insert this file by navigating to the project folder in the CLI
-- and using the following command: 
-- 'psql yewomi < database/schema.sql'

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    security_qn INT,
    security_ans TEXT,
    admin BOOLEAN
);