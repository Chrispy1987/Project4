-- after inserting the schema into the db, insert this file by navigating to the project folder in the CLI
-- and using the following command:
-- 'psql yewomi < database/seed.sql'
-- Note: passwords for users are same as usernames

TRUNCATE users restart identity cascade;
INSERT INTO users(username, email, password, security_qn, security_ans, is_admin) VALUES
('chris', 'chris@ga.com', '$2b$10$wc..uujGo3b3ceXnN80tzOYaWuPXQKu.0GoEWdc2jKVi47g91xDAi', 1, 'test', 't'),
('sid', 'sid@ga.com', '$2b$10$dhxz25GjwVgV2YkgJxBK8eWPxoSjOJywSdnRXfbz78WYXvlj7el6S', 2,'test', 't'),
('dave', 'dave@ga.com', '$2b$10$ng..DJ0BE9VdUvUTk3.dqunsplnc673tHnT9I/g3tY4aD7LgWzCnK', 3,'test', 't'),
('sam', 'sam@ga.com', '$2b$10$kfi/.jZLiYM6hBWEagFvgeaN/IKSJFFdNuop0IhTbyGHYOMGZxY6G', 4,'test', 'f');


TRUNCATE groups restart identity cascade;
INSERT INTO groups(user_id, name, settled) VALUES
(1, 'Test Group #1', null),
(2, 'Test Group #2', null),
(3, 'Test Group #3', null);

TRUNCATE members restart identity cascade;
INSERT INTO members(group_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 4);

TRUNCATE expense restart identity cascade;
INSERT INTO expense(group_id, user_id, amount, date, icon, description) VALUES
(1, 1, 16500, '2022-10-01', 'food', 'subway'),
(1, 1, 5000, '2022-10-01', 'travel', 'train ticket'),
(1, 1, 25000, '2022-10-01', 'entertainment', 'movies'),
(2, 1, 12000, '2022-10-01', 'food', 'KFC'),
(2, 1, 13500, '2022-10-01', 'food', 'Dominos'),
(3, 1, 1000000, '2022-10-01', 'entertainment', 'hack-a-thon');


TRUNCATE borrower restart identity cascade;
INSERT INTO borrower(expense_id, user_id, amount) VALUES
(1, 2, 2200),
(2, 2, 1000),
(3, 2, 8000),
(3, 3, 8000),
(5, 3, 12500),
(6, 4, 999999);