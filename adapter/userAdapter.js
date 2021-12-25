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

    findOne() {
        this.removeConfidentials(this.user);
        const { user, ...rest } = this;
        return rest;
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