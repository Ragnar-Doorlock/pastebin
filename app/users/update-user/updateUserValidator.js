const PASSWORD_VALIDATION_REGEXP = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;

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

        if (request.password) {
            if (request.password.length < 8) {
                errors.push('Minimum password length is 8 characters.');
            }

            if (!PASSWORD_VALIDATION_REGEXP.test(request.password)) {
                errors.push('The password must contain upper case, lower case letters, number and special character.');
            }
        }

        return errors;
    }
}

module.exports = UpdateUserValidator;
