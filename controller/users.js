// FOR ROUTE: '/user/session'

const express = require('express');
const User = require('../models/users');
const { isValidPassword, generateHash } = require('../util/hash');
const router = express.Router();

// Login User
router.post('/', async (request, response) => {
    const email = request.body.email.toLowerCase()
    const password = request.body.password;
    let dbRes;
    try {
        dbRes = await User.checkIfEmailExists(email);        
    } catch (e) {
        response.status(501).json({ success: false, toast: 'Server error: cannot retrieve user data [User.checkIfEmailExists]'});
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

// Signup user 
router.post('/signup', async (request, response) => {
    const username = request.body.username.toLowerCase()
    const email = request.body.email.toLowerCase()
    const password = request.body.password;
   
    // check if email is already in use
    let dbRes;
    try {
        dbRes = await User.checkIfEmailExists(email)
    } catch (e) {
        console.log(e)
        return
    }
    if (dbRes.rows.length > 0) {
        return response.status(400).json({ success: false, toast: "Email already in use!" })
    }

    // check if username is already in use
    try {
        dbRes = await User.checkIfUsernameExists(username)
    } catch (e) {
        console.log(e)
        return
    }
    if (dbRes.rows.length > 0) {
        return response.status(400).json({ success: false, toast: "Username already in use! Please choose another" })
    }

    // hash password for db storage
    const hashedPassword = generateHash(password);

    // create user
    try {
        await User.createUser(username, email, hashedPassword)
    } catch (e) {
        console.log(e)
        return
    }

    return response.json({ success: true, toast: "Sign up successful! Please log in" })

});

// const data = {
//     username: formData.get('username'),
//     email: formData.get('email'),
//     password: formData.get('password')
// };

module.exports = router;