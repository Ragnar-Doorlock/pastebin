const PASSWORD_VALIDATION_REGEXP = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;

class RegisterUserValidator {
    validate(request) {
        const errors = [];

        if (!request.name) {
            errors.push('Name is required');
        } else if (request.name.length > 50) {
            errors.push('Name value is over 50 characters');
        }

        if (!request.password) {
            errors.push('Password is required');
        } else {
            if (request.password.length < 8) {
                errors.push('Minimum password length is 8 characers.');
            }

            if (!PASSWORD_VALIDATION_REGEXP.test(request.password)) {
                errors.push('The password must contain upper case, lower case letters, number and special character.');
            }
        }

        if (!request.login) {
            errors.push('Login is required.');
        } else if (request.login.length < 6) {
            errors.push('Minimum login length is 6.');
        }

        return errors;
    }
}

module.exports = RegisterUserValidator;
