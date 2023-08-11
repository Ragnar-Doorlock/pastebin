const visibilityAcceptedValues = require('../../entities/paste-entity/visibility');

class CreatePasteValidator {
    validate({name, text, visibility, expiresAfter, authorId}) {
        const errors = [];

        if (!name) {
            errors.push('Paste name is required.');
        } else {
            if (name.length > 50) {
                errors.push('Maximum paste length is 50 characters.');
            }
        }

        if (!text) {
            errors.push('Paste text is required.');
        } else {
            if (text.length > 2000) {
                errors.push('Maximum text length is 2000 characters.');
            }
        }

        if (!visibility) {
            errors.push('Paste visibility is required.');
        } else {
            if (!Object.values(visibilityAcceptedValues).includes(visibility)) {
                errors.push('Invalid visibility values.');
            };
        }

        if (!authorId) {
            errors.push('Author ID is required.');
        } else {
            if (!/^user-/.test(authorId)) {
                errors.push('Invalid author ID value.');
            }
        }

        if (!expiresAfter) {
            errors.push('Expiration time is required');
        } else {
            if (!/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(.\d\d\d)?/.test(expiresAfter)) {
                errors.push('Incorrect visibility timestamp value, please use "YYYY-MM-DD hh:mm:ss"');
            }
        }

        return errors;
    }
}

module.exports = CreatePasteValidator;