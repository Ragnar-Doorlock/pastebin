class SearchUrlValidator {
    validate(request) {
        const errors = [];

        if (request.pasteId && !/^paste-/.test(request.pasteId)) {
            errors.push('Invalid paste ID format.');
        }

        if (Array.isArray(request.pasteId)) {
            for (const i of request.pasteId) {
                if (i.length < 20) {
                    errors.push(`ID ${i} is too short.`);
                }
            }
        } else {
            if (request.pasteId && request.pasteId.length < 20) {
                errors.push('ID is too short.');
            }
        }

        return errors;
    }
}
module.exports = SearchUrlValidator;