class CreateUserValidator {
    validate(name) {
        const errors = [];

        if (!name) {
            errors.push('Name is required');
        }

        return errors;
    }
}

module.exports = CreateUserValidator;