class CreateUrlValidator {
    validate(request) {
        const errors = [];

        if (!request.pasteId) {
            errors.push('Paste ID is required.');
        } else {
            if (!/^paste-/.test(request.pasteId)) {
                errors.push('Paste ID format is invalid.');
            }
        }

        return errors;
    }
}

module.exports = CreateUrlValidator;