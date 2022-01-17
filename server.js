const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoService = require('./facade/MongoService');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoService = new MongoService(process.env.DB_URI, mongoose);
mongoService.connect();

const userRouter = require('./routes/user.route');
const eventRouter = require('./routes/event.route');
const tagRouter = require('./routes/tag.route');

const User = require('./models/user.model');
const UserAdapter = require('./adapter/userAdapter');
const TokenAuthenticator = require('./chainOfResponsibility/TokenAuthenticator');
const tokenAuthenticator = new TokenAuthenticator(process.env.ACCESS_TOKEN_SECRET);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/events', tokenAuthenticator.authenticate, eventRouter);
app.use('/api/v1/tags', tokenAuthenticator.authenticate, tagRouter);

app.route('/api/v1/login').post((req, res) => {
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;

    User.findOne({ userName: userName }).populate("userEvents").populate("userCreatedEvents")
        .then(user => {
            let userPublic = new UserAdapter(user);
            if (user.validPassword(userPassword)) { 
                let token = jwt.sign({ id: user._id, username: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30 days" });
                res.json({ authenticated: true, token: token, ...userPublic.findOne() });
            }
            else
                res.status(401).json({ authenticated: false, message: 'Incorrect username or password.' });
        })
        .catch(err => res.status(400).json({ error: err.message }));
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
