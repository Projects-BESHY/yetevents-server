const router = require('express').Router();
let Event = require('../models/event.model');
let Tag = require('../models/tag.model');
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    Event.find().populate("eventTags").populate("eventCreator")
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ error: err }));
})

router.route('/').post((req, res) => {
    const eventTitle = req.body.eventTitle;
    const eventDate = Date.parse(req.body.eventDate);
    const eventDescription = req.body.eventDescription;
    const eventImageUrl = req.body.eventImageUrl;
    const eventLocation = req.body.eventLocation;
    const eventTags = req.body.eventTags;
    const eventCreator = req.body.eventCreator;

    const newEvent = new Event({
        eventTitle, eventDate, eventDescription, eventImageUrl, eventLocation, eventTags, eventCreator
    });

    newEvent.save()
        .then(async () => {
                const event = await Event.findOne({eventTitle: eventTitle});
                const eventId = event._id;
                const tagIds = req.body.eventTags;
                for (let i = 0; i < tagIds.length; i++) {
                    const tag = await Tag.findById(tagIds[i]);
                    tag.tagEvents.push(eventId);
                    tag.save();
                }

                const userId = req.body.eventCreator;
                const creator = await User.findById(userId);
                creator.userCreatedEvents.push(eventId);
                creator.save();

            res.json('Event added');
        })
        .catch(err => res.status(400).json({ error: err }));
})

router.route('/:id').get((req, res) => {
    Event.findById(req.params.id)
        .then(event => res.json(event))
        .catch(err => res.status(400).json({ error: err }));
})

router.route('/:id').put((req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            event.eventTitle = req.body.eventTitle;
            event.eventDate = Date.parse(req.body.eventDate);
            event.eventDescription = req.body.eventDescription;
            event.eventImageUrl = req.body.eventImageUrl;
            event.eventLocation = req.body.eventLocation;
            event.eventTags = req.body.eventTags;

            event.save()
                .then(() => res.json('Event updated'))
                .catch(err => res.status(400).json({ error: err }));
        })
        .catch(err => res.status(400).json({ error: err }));
});

// router.route('/:id').delete((req, res) => {
//     Employee.findByIdAndDelete(req.params.id)
//         .then(() => res.json('Employee deleted'))
//         .catch(err => res.status(400).json({ error: err }));
// })

module.exports = router;