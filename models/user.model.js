const mongoose = require('mongoose');
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