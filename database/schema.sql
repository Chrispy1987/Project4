-- when first creating database:
-- start up psql in CLI by typing 'psql postgres'
-- create database by typing 'CREATE DATABASE yewomi;'
-- quit database with '\q'

-- on each refresh of db, insert this file by navigating to the project folder in the CLI
-- and using the following command: 
-- 'psql yewomi < database/schema.sql'

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    security_qn INT,
    security_ans TEXT,
    is_admin BOOLEAN
);

DROP TABLE IF EXISTS groups CASCADE;
CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT,
    settled BOOLEAN
);

DROP TABLE IF EXISTS members CASCADE;
CREATE TABLE IF NOT EXISTS members (
    member_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS expense CASCADE;
CREATE TABLE IF NOT EXISTS expense (
    expense_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    amount INT,
    date DATE,
    icon TEXT,
    description TEXT
);

DROP TABLE IF EXISTS borrower CASCADE;
CREATE TABLE IF NOT EXISTS borrower (
    borrower_id SERIAL PRIMARY KEY,
    expense_id INT REFERENCES expense(expense_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    amount INT
);