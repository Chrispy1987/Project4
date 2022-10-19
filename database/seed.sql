-- after inserting the schema into the db, insert this file by navigating to the project folder in the CLI
-- and using the following command:
-- 'psql yewomi < database/seed.sql'
-- Note: passwords for users are same as usernames

TRUNCATE users restart identity cascade;
INSERT INTO users(username, email, password, security_qn, security_ans, admin) VALUES
('chris', 'chris@ga.com', '$2b$10$wc..uujGo3b3ceXnN80tzOYaWuPXQKu.0GoEWdc2jKVi47g91xDAi', 1, 'test', 't'),
('sid', 'sid@ga.com', '$2b$10$dhxz25GjwVgV2YkgJxBK8eWPxoSjOJywSdnRXfbz78WYXvlj7el6S', 2,'test', 't'),
('dave', 'dave@ga.com', '$2b$10$ng..DJ0BE9VdUvUTk3.dqunsplnc673tHnT9I/g3tY4aD7LgWzCnK', 3,'test', 't'),
('sam', 'sam@ga.com', '$2b$10$kfi/.jZLiYM6hBWEagFvgeaN/IKSJFFdNuop0IhTbyGHYOMGZxY6G', 4,'test', 'f');