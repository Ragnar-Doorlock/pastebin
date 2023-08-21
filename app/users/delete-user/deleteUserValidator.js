class DeleteUserValidator {
    validate(request) {
        const errors = [];

        if (!request.id) {
            errors.push('ID is required.');
        } else {
            if (!/^user-/.test(request.id)) {
                errors.push('Invalid ID format.');
            }

            if (request.id.length < 20) {
                errors.push('ID is too short.');
            }
        }

        return errors;
    }
}

module.exports = DeleteUserValidator;