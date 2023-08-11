class CreateUserValidator {
    validate({name}) {
        const errors = [];

        if (!name) {
            errors.push('Name is required');
        } else {
            if (name.length > 50) {
                errors.push('Name value is over 50 characters');
            }
        }

        return errors;
    }
}

module.exports = CreateUserValidator;