const visibilityAcceptedValues = require('../../entities/paste-entity/visibility');

class UpdatePasteValidator {
    validate({id, name, text, visibility}) {
        const errors = [];

        if (!id) {
            errors.push('ID is required.');
        } else {
            if (id.length < 20) {
                errors.push('ID is too short.');
            }

            if (!/^paste-/.test(id)) {
                errors.push('Invalid ID format.');
            }
        }

        if (!name) {
            errors.push('Paste name is required.');
        } else {
            if (name.length > 50) {
                errors.push('Paste name is over 50 characters.');
            }
        }

        if (!text) {
            errors.push('Paste text is required.');
        } else {
            if (text.length > 2000) {
                errors.push('Paste text is over 2000 characters.');
            }
        }

        if (!visibility) {
            errors.push('Visibility is required.');
        } else {
            if (!Object.values(visibilityAcceptedValues).includes(visibility)) {
                errors.push('Invalid visibility values.');
            };
        }

        return errors;
    }
}

module.exports = UpdatePasteValidator;