require('dotenv').config();
const router = require('express').Router();
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');
let Event = require('../models/event.model');
const TokenAuthenticator = require('../chainOfResponsibility/TokenAuthenticator');
const tokenAuthenticator = new TokenAuthenticator(process.env.ACCESS_TOKEN_SECRET);

router.route('/').get(tokenAuthenticator.authenticate, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: err.message }));
})

router.route('/').post((req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    const newUser = new User();
    newUser.userName = req.body.userName;
    newUser.userEmail = req.body.userEmail;
    newUser.setPassword(req.body.userPassword);

    newUser.save()
        .then(() => res.json({ success: true, message: 'User added' }))
        .catch(err => res.status(400).json({ error: err.message }));
})

router.route('/:id').get(tokenAuthenticator.authenticate, (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err.message }));
})

router.route('/:id').put(tokenAuthenticator.authenticate, (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.userName = req.body.userName;
            user.userEmail = req.body.userEmail;
            user.setPassword(req.body.userPassword);

            user.save()
                .then(() => res.json({ success: true, message: 'User updated' }))
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// Get all events created by a user
router.route('/:id/events').get(tokenAuthenticator.authenticate, (req, res) => {
    Event.find({ eventCreator: req.params.id }).populate("eventUsers")
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Get all events a user has registered to
router.route('/:id/tickets').get(tokenAuthenticator.authenticate, (req, res) => {
    User.findById(req.params.id).populate("userEvents")
        .then(user => res.json(user.userEvents))
        .catch(err => res.status(400).json({ error: err.message }));
});

// To register a user to an event
router.route('/:userId/events/:eventId').post(tokenAuthenticator.authenticate, (req, res) => {
    Event.updateOne(
        { _id: req.params.eventId },
        { $push: { eventUsers: req.params.userId } })
        .then(async () => {
            const user = await User.findById(req.params.userId);
            user.userEvents.push(req.params.eventId);
            user.save();
            res.json({ success: true, message: 'User registered to event' });
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// To unregister a user from an event
router.route('/:userId/events/:eventId').delete(tokenAuthenticator.authenticate, (req, res) => {
    Event.updateOne(
        { _id: req.params.eventId },
        { $pull: { eventUsers: req.params.userId } })
        .then(async () => {
            const user = await User.findById(req.params.userId);
            const eventIndex = user.userEvents.indexOf(req.params.eventId);
            user.userEvents.splice(eventIndex, 1);
            user.save();

            res.json({ success: true, message: 'User unregistered from event' });
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// router.route('/:id').delete((req, res) => {
//     User.findByIdAndDelete(req.params.id)
//         .then(() => res.json({ success: true, message: 'User deleted'}))
//         .catch(err => res.status(400).json({ error: err.message }));
// })

module.exports = router;