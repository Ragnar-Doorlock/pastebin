class GetUrlValidator {
    validate({pasteId}) {
        const errors = [];

        if(!pasteId) {
            errors.push('ID is required.');
        } else {
            if (!/^paste-/.test(pasteId)) {
                errors.push('Invalid ID format.');
            }

            if (pasteId.length < 20) {
                errors.push('ID is too short.');
            }

            if (pasteId.length > 60) {
                errors.push('ID is too long.');
            }
        }

        return errors;
    }
}

module.exports = GetUrlValidator;