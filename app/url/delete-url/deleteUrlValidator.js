class DeleteUrlValidator {
    validate ({pasteId}) {
        const errors = [];

        if (!pasteId) {
            errors.push('Paste ID is required.');
        } else {
            if (!/^paste-/.test(pasteId)) {
                errors.push('Invalid ID format.');
            }

            if (pasteId.length < 20) {
                errors.push('ID is too short.');
            }
        }
        
        return errors;
    }
}

module.exports = DeleteUrlValidator;