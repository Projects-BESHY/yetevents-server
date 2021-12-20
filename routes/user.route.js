const router = require('express').Router();
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');
let Event = require('../models/event.model');

router.route('/').get(authenticateToken, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/').post((req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    // added for the map
    const userAddress = req.body.userAddress;
    const newUser = new User({
        userName, userEmail, userPassword, userAddress
    });

    newUser.save()
        .then(() => res.json('User added'))
        .catch((err)=> {
            console.error(err)
            if (err.code === 11000) {
                return res.status(400).json({ error: 'This user already exists' });
              }
              res.status(500).json({ error: 'Server error' });        }
            );
})

router.route('/:id').get(authenticateToken, (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').put(authenticateToken, (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.userName = req.body.userName;
            user.userEmail = req.body.userEmail;
            user.userPassword = req.body.userPassword;

            user.save()
                .then(() => res.json('User updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get all events created by a user
router.route('/:id/events').get(authenticateToken, (req, res) => {
    Event.find({ eventCreator: req.params.id }).populate("eventUsers")
        .then(events => res.json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get all events a user has registered to
router.route('/:id/tickets').get(authenticateToken, (req, res) => {
    User.findById(req.params.id).populate("userEvents")
        .then(user => res.json(user.userEvents))
        .catch(err => res.status(400).json('Error: ' + err));
});

// To register a user to an event
router.route('/:userId/events/:eventId').post(authenticateToken, (req, res) => {
    Event.updateOne(
        { _id: req.params.eventId },
        { $push: { eventUsers: req.params.userId } })
        .then(async () => {
            const user = await User.findById(req.params.userId);
            user.userEvents.push(req.params.eventId);
            user.save();
            res.json('User registered to event');
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// To unregister a user from an event
router.route('/:userId/events/:eventId').delete(authenticateToken, (req, res) => {
    Event.updateOne(
        { _id: req.params.eventId },
        { $pull: { eventUsers: req.params.userId } })
        .then(async () => {
            const user = await User.findById(req.params.userId);
            const eventIndex = user.userEvents.indexOf(req.params.eventId);
            user.userEvents.splice(eventIndex, 1);
            user.save();

            res.json('User unregistered from event');
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/:id').delete((req, res) => {
//     User.findByIdAndDelete(req.params.id)
//         .then(() => res.json('User deleted'))
//         .catch(err => res.status(400).json('Error: ' + err));
// })

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token. Please provide one in the request header Authorization.' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    })
}

module.exports = router;