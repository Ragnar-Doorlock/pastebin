class GetPasteValidator {
    validate(request) {
        const errors = [];

        if (!request.id) {
            errors.push('ID is required.');
        } else {
            if (request.id.length < 20) {
                errors.push('ID is too short');
            }

            if (!/^paste-/.test(request.id)) {
                errors.push('Invalid ID format');
            }

            if (request.id.length > 60) {
                errors.push('ID is too long.');
            }
        }

        return errors;
    }
}

module.exports = GetPasteValidator;
