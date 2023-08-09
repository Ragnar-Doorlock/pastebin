const visibilityAcceptedValues = require('../../entities/paste-entity/visibility');

class UpdatePasteValidator {
    validate({id, name, text, visibility}) {
        const errors = [];

        if (!id && !name && !text && !visibility) {
            errors.push('Parameters are required.');
        }

        if (!id) {
            errors.push('ID is required.');
        }

        if (!name) {
            errors.push('Paste name is required.');
        }

        if (!text) {
            errors.push('Paste text is required.');
        }

        if (!visibility) {
            errors.push('Visibility is required.');
        }

        if (id && !/^paste-/.test(id)) {
            errors.push('Invalid ID format.');
        }

        if (id && id.length < 20) {
            errors.push('ID is too short.');
        }

        if (name && name.length > 50) {
            errors.push('Paste name is over 50 characters.');
        }

        if (text && text.length > 2000) {
            errors.push('Paste text is over 2000 characters.');
        }

        if (visibility && !Object.values(visibilityAcceptedValues).includes(visibility)) {
            errors.push('Invalid visibility values.');
        };

        return errors;
    }
}

module.exports = UpdatePasteValidator;