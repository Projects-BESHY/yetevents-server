const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const Event = require('./event.model');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    userLocation:{
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
    userEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    userCreatedEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
}, {
    timestamps: true,
});


// Geocode & create location
userSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.userAddress);
    this.userLocation = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };
  
    // Do not save address
    this.userAddress = undefined;
    next();
  }
  );


// for cascading delete
// userSchema.pre('findOneAndDelete', function(next) {
//     console.log("In pre schema hook deleting... " + this);
//     Event.deleteOne({eventCreator: this._id}).exec();
//     console.log("Removed event");
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;