const express = require('express');
const User = require('../models/users');
const { isValidPassword, generateHash } = require('../util/hash');
const router = express.Router();

// Login User
router.post('/', (request, response) => {
    const email = request.body.email.toLowerCase()
    const password = request.body.password;
    User.checkExists(email)
        .then(dbRes => {
            if (dbRes.rowCount === 0) {
                return response.json({ message: 'The username and/or password you have entered is incorrect.' })
            }
            const user = dbRes.rows[0];
            const hashedPassword = user.password;
            if (isValidPassword(password, hashedPassword)) {
                request.session.email = email;
                request.session.user_id = user.id;
                return response.json({ id: user.id, message: "Login successful!" })
            }
            return response.json({ message: 'The username and/or password you have entered is incorrect.' })
        })
        .catch(() => response.sendStatus(500))
})

// Logout user
router.delete('/', (request, response) => {
    const userExists = request.session.user_id
    if (userExists) {
        request.session.destroy()
        return response.json({})
    } else {
        return response.status(400).json({ message: 'No users are logged in. How did you get here!?' })
    }
});

module.exports = router;