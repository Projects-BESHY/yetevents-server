const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

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
    eventAddress: {
        type: String,
        required: true
    },
    eventLocation:{
        type: {
            type: String,
            enum: ['Point']
          },
          coordinates: {
            type: [Number],
            index: '2dsphere'
          },
          formattedAddress: String
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

// eventSchema.index({ eventLocation: "2dsphere" });
// Geocode & create location
eventSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.eventAddress);
    this.eventLocation = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };
  
    // Do not save address
    this.eventAddress = undefined;
    next();
  }
  );


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;