const UpdateUserValidator = require('../../../app/users/update-user/updateUserValidator');

describe('UpdateUserValidator', () => {
    let updateUserValidator;
    beforeEach(() => {
        updateUserValidator = new UpdateUserValidator();
    });

    describe('validate()', () => {
        let request = {};

        it('should return no errors if data is valid', () => {
            request = {
                id: 'user-11121243243424324234423',
                name: '[fake-name]'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors.length).toEqual(0);
        });

        it('should return error if id was not provided', () => {
            request = {
                name: '[fake-name]',
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('ID is required.');
        });

        it('should return error if name was not provided', () => {
            request = {
                id: 'user-14893123123121231321',
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('Name is required.');
        });

        it('should validate that id starts with "user-"', () => {
            request = {
                id: 'usr-11121243243424324234423',
                name: '[fake-name]',
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('Invalid ID format.');
        });

        it('should return error if name was not provided', () => {
            request = {
                id: 'user-1489',
                name: '[fake-name]'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('ID is too short.');
        });

        it('should return error if name was not provided', () => {
            request = {
                id: 'user-1489342342342342342323',
                name: '[fake-name-tooooooooooooooooooooooooo-many-symbols]'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('Name value is over 50 characters.');
        });

        it('should validate minimum password length', () => {
            request = {
                id: 'user-1489342342342342342323',
                name: '[fake-name]',
                password: '123Aa!'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('Minimum password length is 8 characters.');
        });

        it('should validate that password must contain special character', () => {
            request = {
                name: '[fake-name]',
                id: 'user-1489342342342342342323',
                password: '20072007Aa'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should validate that password must contain lower case character', () => {
            request = {
                name: '[fake-name]',
                id: 'user-1489342342342342342323',
                password: '20072007AA!'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });

        it('should validate that password must contain upper case character', () => {
            request = {
                name: '[fake-name]',
                id: 'user-1489342342342342342323',
                password: '20072007aa!'
            };
            const errors = updateUserValidator.validate(request);
            expect(errors).toContain('The password must contain upper case, lower case letters, number and special character.');
        });
    });
});
