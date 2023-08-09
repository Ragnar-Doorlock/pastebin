class DeleteUrlValidator {
    validate ({pasteId}) {
        const errors = [];

        if (!pasteId) {
            errors.push('Paste ID is required.');
        }

        if (pasteId && !/^paste-/.test(pasteId)) {
            errors.push('Invalid ID format.');
        }

        if (pasteId && pasteId.length < 20) {
            errors.push('ID is too short.');
        }

        return errors;
    }
}

module.exports = DeleteUrlValidator;