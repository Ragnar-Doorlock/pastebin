class GetUrlValidator {
    validate(request) {
        const errors = [];

        if(!request.urlId) {
            errors.push('ID is required.');
        } else {
            if (!/^paste-/.test(request.urlId)) {
                errors.push('Invalid ID format.');
            }

            if (request.urlId.length < 20) {
                errors.push('ID is too short.');
            }

            if (request.urlId.length > 60) {
                errors.push('ID is too long.');
            }
        }

        return errors;
    }
}

module.exports = GetUrlValidator;