class GetUrlValidator {
    validate({pasteId}) {
        const errors = [];

        if(!pasteId) {
            errors.push('ID is required.');
        }

        if (!/^paste-/.test(pasteId)) {
            errors.push('Invalid ID format');
        }

        if (pasteId.length < 20) {
            errors.push('ID is too short');
        }

        return errors;
    }
}

module.exports = GetUrlValidator;