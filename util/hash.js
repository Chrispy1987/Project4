const bcrypt = require('bcrypt');

// encrypt password to store in db
const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}
// compare passwords
const isValidPassword = (plainTextPassword, passwordHash) => {
    return bcrypt.compareSync(plainTextPassword, passwordHash)
}

module.exports = { generateHash, isValidPassword }