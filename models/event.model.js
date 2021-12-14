const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventTitle: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventImageUrl: { type: String },
    eventLocation: {
        type: { type: String },
        coordinates: []
    },
    eventTags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ],
    eventUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    eventCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

eventSchema.index({ eventLocation: "2dsphere" });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;