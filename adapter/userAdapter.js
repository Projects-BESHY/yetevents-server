const UserPublic = require('./userPublic');

class UserAdapter extends UserPublic {

    _id;
    userName;
    userEmail;
    userEvents;
    userCreatedEvents;

    constructor(user) {
        super();
        this.user = user;
    }

    findOne(userName) {
        return new Promise((resolve, reject) => {

            this.user.findOne({ userName: userName }).populate("userEvents").populate("userCreatedEvents")
                .then(u => {
                    this.removeConfidentials(u);
                    resolve(this);
                })
                .catch(err => { reject(err) });
        });
    }

    // helper function
    removeConfidentials(user) {
        this._id = user._id;
        this.userName = user.userName;
        this.userEmail = user.userEmail;
        this.userEvents = user.userEvents;
        this.userCreatedEvents = user.userCreatedEvents;
    }
}

module.exports = UserAdapter;