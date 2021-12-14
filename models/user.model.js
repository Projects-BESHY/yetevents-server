const mongoose = require('mongoose');
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
    ]
}, {
    timestamps: true,
});

// for cascading delete
// userSchema.pre('findOneAndDelete', function(next) {
//     console.log("In pre schema hook deleting... " + this);
//     Event.deleteOne({eventCreator: this._id}).exec();
//     console.log("Removed event");
//     next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;