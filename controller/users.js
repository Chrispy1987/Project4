// FOR ROUTE: '/user/session'

const express = require('express');
const User = require('../models/users');
const { isValidPassword } = require('../util/hash');
const router = express.Router();

// Login User
router.post('/', async (request, response) => {
    const email = request.body.email.toLowerCase()
    const password = request.body.password;
    let dbRes;
    try {
        dbRes = await User.checkExists(email);        
    } catch (e) {
        response.status(501).json({ success: false, toast: 'Server error: cannot retrieve user data [User.checkExists]'});
    }

    if (dbRes.rowCount === 0) {
        return response.status(400).json({ success: false, toast: 'The username and/or password you have entered is incorrect.' })
    }
    const data = dbRes.rows[0];
    const hashedPassword = data.password;
    if (isValidPassword(password, hashedPassword)) {
        request.session.user_id = data.user_id;
        return response.json({ success: true, userId: data.user_id, toast: "Login successful!" })
    }
    return response.status(400).json({ success: false, toast: 'The username and/or password you have entered is incorrect.' })
})

// Logout user
router.delete('/', (request, response) => {
    const userExists = request.session.user_id
     if (userExists) {
        request.session.destroy()
        return response.json({})
    } else {
        return response.status(400).json({ success: false, toast: 'No users are logged in. How did you get here!?' })
    }
});

module.exports = router;