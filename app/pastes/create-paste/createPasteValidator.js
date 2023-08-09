const visibilityAcceptedValues = require('../../entities/paste-entity/visibility');

class CreatePasteValidator {
    validate({name, text, visibility, expiresAfter, authorId}) {
        const errors = [];

        if (!name && !text && !visibility && !authorId && expiresAfter) {
            errors.push('Parameters are required.');
        }

        if (!name) {
            errors.push('Paste name is required.');
        }

        if (!text) {
            errors.push('Paste text is required.');
        }

        if (!visibility) {
            errors.push('Paste visibility is required.');
        }

        if (!authorId) {
            errors.push('Author ID is required.');
        }

        if (name && name.length > 50) {
            errors.push('Maximum paste length is 50 characters.');
        }

        if (text && text.length > 2000) {
            errors.push('Maximum text length is 2000 characters.');
        }

        // ?
        if (visibility && !Object.values(visibilityAcceptedValues).includes(visibility)) {
            errors.push('Invalid visibility values.');
        };

        if (authorId && !/^user-/.test(authorId)) {
            errors.push('Invalid author ID value.');
        }

        if (!expiresAfter) {
            errors.push('Expiration time is required');
        }

        return errors;
    }
}

module.exports = CreatePasteValidator;