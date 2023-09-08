const ApiError = require('./apiError');

class ForbiddenError extends ApiError {
    constructor(message) {
        super({ httpCode: 403, message });
        this.name = this.constructor.name;
    }
}

module.exports = ForbiddenError;
