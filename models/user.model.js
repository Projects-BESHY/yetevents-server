const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const crypto = require('crypto');
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
    ],
    salt: {
        type: String,
        required: true
    }
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

userSchema.methods.setPassword = function (password) {
    // Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 
    this.userPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

userSchema.methods.validPassword = function(password) { 
    let userPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.userPassword === userPassword;
}; 

// for cascading delete
// userSchema.pre('findOneAndDelete', function(next) {
//     console.log("In pre schema hook deleting... " + this);
//     Event.deleteOne({eventCreator: this._id}).exec();
//     console.log("Removed event");
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;