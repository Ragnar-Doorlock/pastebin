const LoginValidator = require('../app/users/login/loginValidator');

describe('LoginValidator', () => {
    const validPassword = '2822281337Aa!';
    let loginValidator;
    beforeEach(() => {
        loginValidator = new LoginValidator();
    });

    describe('validate()', () => {
        let request = {};

        it('should return error if login was not provided', () => {
            request = {};
            const errors = loginValidator.validate(request);
            expect(errors).toContain('Login is required.');
        });

        it('should return error if password was not provided', () => {
            request = {};
            const errors = loginValidator.validate(request);
            expect(errors).toContain('Password is required');
        });

        it('should return no errors if login and password were provided', () => {
            request = {
                login: '[fake-login]',
                password: validPassword
            };
            const errors = loginValidator.validate(request);
            expect(errors.length).toEqual(0);
        });

        it('should validate minimum login length', () => {
            request = {
                login: 'login',
                password: validPassword
            };
            const errors = loginValidator.validate(request);
            expect(errors).toContain('Minimum login length is 6 characters.');
        });

        it('should validate minimum password length', () => {
            request = {
                login: '[fake-login]',
                password: '2007'
            };
            const errors = loginValidator.validate(request);
            expect(errors).toContain('Minimum password length is 8 characters.');
        });

        it('should validate that password must contain special character', () => {
            request = {
                login: '[fake-login]',
                password: '20072007Aa'
            };
            const errors = loginValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should validate that password must contain lower case character', () => {
            request = {
                login: '[fake-login]',
                password: '20072007AA!'
            };
            const errors = loginValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should validate that password must contain upper case character', () => {
            request = {
                login: '[fake-login]',
                password: '20072007aa!'
            };
            const errors = loginValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });
    });
});
