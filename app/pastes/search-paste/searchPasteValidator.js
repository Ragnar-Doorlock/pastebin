class SearchPasteValidator {
    validate(request) {
        const errors = [];

        if (request.id && !/^paste-/.test(request.id)) {
            errors.push('Invalid ID format.');
        }

        if (request.name && request.name.length === 0) {
            errors.push('Name value is invalid.');
        }

        if (Array.isArray(request.id)) {
            for (const i of request.id) {
                if (i.length < 20) {
                    errors.push(`ID ${i} is too short.`);
                }
            }
        } else if (request.id && request.id.length < 20) {
            errors.push('ID is too short.');
        }

        if (request.authorId && !/^user-/.test(request.authorId)) {
            errors.push('Invalid ID format.');
        }

        return errors;
    }
}

module.exports = SearchPasteValidator;
