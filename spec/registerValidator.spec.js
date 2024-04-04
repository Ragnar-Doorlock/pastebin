const RegisterUserValidator = require('../app/users/register-user/registerUserValidator');

describe('RegisterValidator', () => {
    let registerValidator;
    beforeEach(() => {
        registerValidator = new RegisterUserValidator();
    });

    describe('validate()', () => {
        let request = {};

        it('should return error if name was not provided', () => {
            request = {};
            const errors = registerValidator.validate(request);
            expect(errors).toContain('Name is required');
        });

        it('should return error if login was not provided', () => {
            request = {};
            const errors = registerValidator.validate(request);
            expect(errors).toContain('Login is required.');
        });

        it('should return error if password was not provided', () => {
            request = {};
            const errors = registerValidator.validate(request);
            expect(errors).toContain('Password is required');
        });

        it('should validate maximum name length', () => {
            request = {
                name: 'Name-name-name-name-name-name-name-name-name-name-name',
                password: '20072007Aa!',
                login: '[fake-login]'
            };
            const errors = registerValidator.validate(request);
            expect(errors).toContain('Name value is over 50 characters');
        });

        it('should validate minimum password length', () => {
            request = {
                name: '[fake-name]',
                password: '2002Aa!',
                login: '[fake-login]'
            };
            const errors = registerValidator.validate(request);
            expect(errors).toContain('Minimum password length is 8 characters.');
        });

        it('should validate minimum login length', () => {
            request = {
                name: '[fake-name]',
                password: '2002222Aa!',
                login: 'login'
            };
            const errors = registerValidator.validate(request);
            expect(errors).toContain('Minimum login length is 6.');
        });

        it('should validate that password must contain special character', () => {
            request = {
                name: '[fake-name]',
                login: '[fake-login]',
                password: '20072007Aa'
            };
            const errors = registerValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should validate that password must contain lower case character', () => {
            request = {
                name: '[fake-name]',
                login: '[fake-login]',
                password: '20072007AA!'
            };
            const errors = registerValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should validate that password must contain upper case character', () => {
            request = {
                name: '[fake-name]',
                login: '[fake-login]',
                password: '20072007aa!'
            };
            const errors = registerValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should return no errors if data is valid', () => {
            request = {
                name: '[fake-name]',
                login: '[fake-login]',
                password: '20072007Aa!'
            };
            const errors = registerValidator.validate(request);
            expect(errors.length).toEqual(0);
        });
    });
});
