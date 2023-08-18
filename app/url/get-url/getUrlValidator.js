class GetUrlValidator {
    validate(request) {
        const errors = [];

        if(!request.pasteId) {
            errors.push('ID is required.');
        } else {
            if (!/^paste-/.test(request.pasteId)) {
                errors.push('Invalid ID format.');
            }

            if (request.pasteId.length < 20) {
                errors.push('ID is too short.');
            }

            if (request.pasteId.length > 60) {
                errors.push('ID is too long.');
            }
        }

        return errors;
    }
}

module.exports = GetUrlValidator;