class Handler {
    constructor(nextHandler) {
        this.nextHandler = nextHandler;
    }

    handle(req) {
        if (doHandle(req)) {
            return;
        }

        if (this.nextHandler != null) {
            this.nextHandler.handle(req);
        }
    }

    doHandle(req) { }
}

module.exports = Handler;