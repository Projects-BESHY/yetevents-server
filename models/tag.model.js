const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tagName: {
        type: String,
        required: true,
        unique: true
    },
    tagEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
}, {
    timestamps: true,
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;