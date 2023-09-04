class LoginValidator {
    validate(request) {
        const errors = [];

        if (!request.login) {
            errors.push('Login is required.');
        } else if (request.login.length < 6) {
            errors.push('Minimum login length is 6 characters.');
        }

        if (!request.password) {
            errors.push('Password is required');
        } else {
            if (request.password.length < 8) {
                errors.push('Minimum password length is 8 characters.');
            }

            if (!/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/.test(request.password)) {
                errors.push('The password must contain upper case, lower case letters, number and special character.');
            }
        }

        return errors;
    }
}

module.exports = LoginValidator;
