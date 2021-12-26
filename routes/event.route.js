const router = require('express').Router();
let Event = require('../models/event.model');
let Tag = require('../models/tag.model');
let User = require('../models/user.model');

// ger all events
router.route('/').get((req, res) => {
    Event.find().populate("eventTags").populate("eventCreator")
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ error: err.message }));
})

// create new event
router.route('/').post((req, res) => {
    const eventTitle = req.body.eventTitle;
    const eventDate = Date.parse(req.body.eventDate);
    const eventDescription = req.body.eventDescription;
    const eventImageUrl = req.body.eventImageUrl;
    const eventAddress = req.body.eventAddress;
    const eventTags = req.body.eventTags;
    const eventCreator = req.body.eventCreator;

    const newEvent = new Event({
        eventTitle, eventDate, eventDescription, eventImageUrl, eventAddress, eventTags, eventCreator
    });

    newEvent.save()
        .then(async () => {
            const event = await Event.findOne({ eventTitle: eventTitle });
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

            res.json({ success: true, message: 'Event added' });
        })
        .catch(err => res.status(400).json({ error: err.message }));
})

// get an event
router.route('/:id').get((req, res) => {
    Event.findById(req.params.id)
        .then(event => res.json(event))
        .catch(err => res.status(400).json({ error: err.message }));
})
// update an event 
router.route('/:id').put((req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            event.eventTitle = req.body.eventTitle;
            event.eventDate = Date.parse(req.body.eventDate);
            event.eventDescription = req.body.eventDescription;
            event.eventImageUrl = req.body.eventImageUrl;
            event.eventAddress = req.body.eventAddress;
            event.eventTags = req.body.eventTags;

            event.save()
                .then(() => res.status(201).json({ success: true, message: 'Event updated' }))
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// router.route('/:id').delete((req, res) => {
//     Employee.findByIdAndDelete(req.params.id)
//         .then(() => res.json('Employee deleted'))
//         .catch(err => res.status(400).json({ error: err.message }));
// })

module.exports = router;