const db = require("../database/db");

const User = {
  checkIfEmailExists: (email) => {
    const sql = `
    SELECT * 
    FROM users 
    WHERE email=$1
    `
    return db.query(sql, [email])
      .then(dbRes => dbRes)
  },
  checkIfUsernameExists: (username) => {
    const sql = `
    SELECT username 
    FROM users 
    WHERE username=$1
    `
    return db.query(sql, [username])
      .then(dbRes => dbRes)
  },
  createUser: (username, email, hashedPassword) => {
    const sql = `
    INSERT INTO users(username, email, password, is_admin)
    VALUES($1, $2, $3, null)
    `
    return db.query(sql, [username, email, hashedPassword])
  }
}

module.exports = User;
