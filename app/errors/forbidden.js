const ApiError = require('./apiError');

class Forbidden extends ApiError {
    constructor(message) {
        super({ httpCode: 403, message });
        this.name = this.constructor.name;
    }
}

module.exports = Forbidden;
