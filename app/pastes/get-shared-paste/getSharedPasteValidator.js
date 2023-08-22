class GetSharedPasteValidator {
    validate(request) {
        const errors = [];

        if (!request.hash) {
            errors.push('Invalid link.');
        } else if (request.hash.length < 100) {
            errors.push('Link is too short');
        }

        return errors;
    }
}

module.exports = GetSharedPasteValidator;
