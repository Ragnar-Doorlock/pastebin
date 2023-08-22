class UpdateUserValidator {
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

        if (!request.name) {
            errors.push('Name is required.');
        } else {
            if (request.name.length === 0) {
                errors.push('Name is required.');
            }

            if (request.name.length > 50) {
                errors.push('Name value is over 50 characters.');
            }
        }

        return errors;
    }
}

module.exports = UpdateUserValidator;
