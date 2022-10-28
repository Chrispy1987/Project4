-- after inserting the schema into the db, insert this file by navigating to the project folder in the CLI
-- and using the following command:
-- 'psql yewomi < database/seed.sql'
-- Note: passwords for users are same as usernames

TRUNCATE users restart identity cascade;
INSERT INTO users(username, email, password, is_admin) VALUES
('chris', 'chris@ga.com', '$2b$10$wc..uujGo3b3ceXnN80tzOYaWuPXQKu.0GoEWdc2jKVi47g91xDAi', 't'),
('sid', 'sid@ga.com', '$2b$10$dhxz25GjwVgV2YkgJxBK8eWPxoSjOJywSdnRXfbz78WYXvlj7el6S', 't'),
('dave', 'dave@ga.com', '$2b$10$ng..DJ0BE9VdUvUTk3.dqunsplnc673tHnT9I/g3tY4aD7LgWzCnK','t'),
('sam', 'sam@ga.com', '$2b$10$kfi/.jZLiYM6hBWEagFvgeaN/IKSJFFdNuop0IhTbyGHYOMGZxY6G', 'f');


TRUNCATE groups restart identity cascade;
INSERT INTO groups(user_id, name, settled) VALUES
(1, 'TEST GROUP #1', null),
(1, 'TEST GROUP #2', null),
(1, 'TEST GROUP #3', null),
(1, 'TEST GROUP #4', null),
(2, 'TEST GROUP #5', null);

TRUNCATE members restart identity cascade;
INSERT INTO members(group_id, user_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 2);

TRUNCATE expense restart identity cascade;
INSERT INTO expense(group_id, user_id, amount, date, icon, description) VALUES
(1, 2, 1650, '2022-10-01', 'food', 'subway'),
(1, 1, 500, '2022-05-01', 'travel', 'train ticket'),
(1, 2, 2500, '2021-05-12', 'entertainment', 'movies'),
(2, 1, 1200, '2022-10-01', 'food', 'KFC'),
(2, 1, 1350, '2022-02-01', 'food', 'Dominos'),
(3, 1, 100000, '2022-10-01', 'entertainment', 'hack-a-thon');


TRUNCATE borrower restart identity cascade;
INSERT INTO borrower(expense_id, user_id, amount) VALUES
(1, 1, 550),
(2, 2, 100),
(3, 1, 800),
(3, 3, 800),
(4, 3, 600),
(5, 3, 1250),
(6, 4, 99999);

TRUNCATE invites restart identity cascade;
INSERT INTO invites(group_id, user_id, inviter) VALUES
(1, 2, 1),
(2, 2, 1),
(3, 2, 1),
(4, 2, 1),
(5, 1, 2),
(1, 3, 1),
(2, 3, 1),
(3, 3, 1),
(4, 3, 1),
(5, 3, 1),
(1, 4, 1),
(2, 4, 1),
(3, 4, 1),
(4, 4, 1),
(5, 4, 1);
