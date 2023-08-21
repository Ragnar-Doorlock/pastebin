const ApiError = require('./apiError');

class NotFound extends ApiError {
    constructor (message) {
        super({httpCode: 404, message});
        //this.httpCode = 404;
        this.name = this.constructor.name;
    }
}

module.exports = NotFound;