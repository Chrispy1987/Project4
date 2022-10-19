const express = require('express');
const { expressSession, pgSession } = require('./controller/session');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("./client/build"));
app.use(express.json());

// Database
const db = require('./database/db')
app.use(
    expressSession({
        store: new pgSession({
            pool: db,
            createTableIfMissing: true,
        }),
        secret: process.env.EXPRESS_SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false
    })
);

// Middleware
app.use((request, res, next) => {
    console.log(`*** Request method: ${request.method} and route: ${request.path} at ${new Date()} ***`)
    next();
})

// Controllers
const usersController = require('./controller/users');

// API Routing
app.use('/user/session', usersController);

// Port
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});