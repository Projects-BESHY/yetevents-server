const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const userRouter = require('./routes/user.route');
const eventRouter = require('./routes/event.route');
const tagRouter = require('./routes/tag.route');

const User = require('./models/user.model');

app.use('/api/v1/users', userRouter);
app.use('/api/v1/events', eventRouter); 
app.use('/api/v1/tags', tagRouter); 

app.route('/api/v1/login').post((req, res) => {
    const userName = req.body.userName;
    const userPassword = req.body.userPassword;

    User.findOne({userName: userName})
        .then(user => {
            console.log(user);
            if (userPassword === user.userPassword) {
                res.json("Authenticated user");
            } else {
                res.json("Unauthenticated user");
            }
        })
        .catch(err => res.status(400).json('Error: ') + err);
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// nodemon server TO RUN