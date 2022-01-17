class MongoService {

    constructor(uri, mongoose) {
        this.uri = uri;
        this.mongoose = mongoose;
    }

    connect() {
        this.mongoose.connect(this.uri);
        this.mongoose.connection.once('open', () => {
            console.log("MongoDB database connection established successfully");
        });
    }
}

module.exports = MongoService;