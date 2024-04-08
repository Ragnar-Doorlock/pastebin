const GetUserValidator = require('../../../app/users/get-user/getUserValidator');

describe('GetUserValidator', () => {
    let getUserValidator;
    beforeEach(() => {
        getUserValidator = new GetUserValidator();
    });

    describe('validate()', () => {
        let request = {};

        it('should return no errors if valid id was provided', () => {
            request = { id: 'user-148813372822281122' };
            const errors = getUserValidator.validate(request);
            expect(errors.length).toEqual(0);
        });

        it('should return error if no id was provided', () => {
            request = {};
            const errors = getUserValidator.validate(request);
            expect(errors).toContain('ID is required');
        });

        it('should return error if id is too short', () => {
            request = { id: 'user-111' };
            const errors = getUserValidator.validate(request);
            expect(errors).toContain('ID is too short');
        });

        it('should return error if id is too long', () => {
            request = { id: 'user-11111111111111111111111111111111111111111111111111111111' };
            const errors = getUserValidator.validate(request);
            expect(errors).toContain('ID is too long.');
        });

        it('should return error if id has invalid format', () => {
            request = { id: '1111111111111111111111111111' };
            const errors = getUserValidator.validate(request);
            expect(errors).toContain('Invalid ID format');
        });
    });
});
