class CreateUrlValidator {
    validate({pasteId, hash}) {
        const errors = [];

        if (!pasteId) {
            errors.push('Paste ID is required.');
        } else {
            if (!/^paste-/.test(pasteId)) {
                errors.push('Paste ID format is invalid.');
            }
        }

        return errors;
    }
}

module.exports = CreateUrlValidator;