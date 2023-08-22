class CreateUserValidator {
    validate(request) {
        const errors = [];

        if (!request.name) {
            errors.push('Name is required');
        } else if (request.name.length > 50) {
            errors.push('Name value is over 50 characters');
        }

        return errors;
    }
}

module.exports = CreateUserValidator;
