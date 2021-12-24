const router = require('express').Router();
let Tag = require('../models/tag.model');

router.route('/').get((req, res) => {
    Tag.find().populate("tagEvents") 
        .then(tags => res.json(tags))
        .catch(err => res.status(400).json({ error: err }));
})

router.route('/').post((req, res) => {
    const tagName = req.body.tagName;

    const newTag = new Tag({
        tagName
    });

    newTag.save()
        .then(() => res.json({ success: true, message: 'Tag added' }))
        .catch(err => res.status(400).json({ error: err }));
})

router.route('/:id').get((req, res) => {
    Tag.findById(req.params.id)
        .then(tag => res.json(tag))
        .catch(err => res.status(400).json({ error: err }));
})

router.route('/:id').post((req, res) => {
    Tag.findById(req.params.id)
        .then(tag => {
            tag.tagName = req.body.tagName;

            tag.save()
                .then(() => res.json({ success: true, message: 'Tag updated' }))
                .catch(err => res.status(400).json({ error: err }));
        })
        .catch(err => res.status(400).json({ error: err }));
});

router.route('/:id/events').get((req, res) => {
    Tag.findById(req.params.id).populate("tagEvents")
        .then(tag => res.json(tag.tagEvents))
        .catch(err => res.status(400).json({ error: err }));
})

module.exports = router;