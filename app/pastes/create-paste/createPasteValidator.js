const visibilityAcceptedValues = require('../../entities/paste-entity/visibility');
const EXPIRES_AFTER_REGEX = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(.\d\d\d)?/;

class CreatePasteValidator {
    validate(request) {
        const errors = [];

        if (!request.name) {
            errors.push('Paste name is required.');
        } else if (request.name.length > 50) {
            errors.push('Maximum paste length is 50 characters.');
        }

        if (!request.text) {
            errors.push('Paste text is required.');
        } else if (request.text.length > 2000) {
            errors.push('Maximum text length is 2000 characters.');
        }

        if (!request.visibility) {
            errors.push('Paste visibility is required.');
        } else if (!Object.values(visibilityAcceptedValues).includes(request.visibility)) {
            errors.push('Invalid visibility values.');
        }

        if (!request.expiresAfter) {
            errors.push('Expiration time is required');
        } else if (!EXPIRES_AFTER_REGEX.test(request.expiresAfter)) {
            errors.push('Incorrect visibility timestamp value, please use "YYYY-MM-DD hh:mm:ss"');
        }

        return errors;
    }
}

module.exports = CreatePasteValidator;
