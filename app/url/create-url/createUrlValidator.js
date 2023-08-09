class CreateUrlValidator {
    validate({pasteId, hash}) {
        const errors = [];

        if (!pasteId && !hash) {
            errors.push('Paste ID and hash are required.')
        }

        if (!pasteId) {
            errors.push('Paste ID is required.');
        }

        // won't be needed since it will be generated
        /* if (!hash) {
            errors.push('Hash is required');
        } */

        if (pasteId && !/^paste-/.test(pasteId)) {
            errors.push('Paste ID format is invalid.');
        }

        return errors;
    }
}

module.exports = CreateUrlValidator;