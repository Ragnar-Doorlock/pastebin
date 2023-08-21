class DeleteUrlValidator {
    validate (request) {
        const errors = [];

        if (!request.pasteId) {
            errors.push('Paste ID is required.');
        } else {
            if (!/^paste-/.test(request.pasteId)) {
                errors.push('Invalid ID format.');
            }

            if (request.pasteId.length < 20) {
                errors.push('ID is too short.');
            }
        }
        
        return errors;
    }
}

module.exports = DeleteUrlValidator;