const SearchUserValidator = require('../app/users/search-users/searchUserValidator');

describe('SearchUserValidator', () => {
    let searchUserValidator;
    beforeEach(() => {
        searchUserValidator = new SearchUserValidator();
    });

    describe('validate()', () => {
        let request;

        it('should validate minimum id length for each id in array', () => {
            request = {
                id: ['user-111', 'user-22280248020482048024', 'user-333']
            };
            const errors = searchUserValidator.validate(request);
            expect(errors).toContain('ID user-111 is too short.');
            expect(errors).toContain('ID user-333 is too short.');
        });

        it('should validate minimum id length (not array)', () => {
            request = {
                id: 'user-111'
            };
            const errors = searchUserValidator.validate(request);
            expect(errors).toContain('ID is too short.');
        });

        it('should validate that id starts with "user-"', () => {
            request = {
                id: 'usr-11121243243424324234423'
            };
            const errors = searchUserValidator.validate(request);
            expect(errors).toContain('Invalid ID format.');
        });

        it('should return no errors if data is valid', () => {
            request = {
                id: 'user-11121243243424324234423',
                name: '[fake-name]'
            };
            const errors = searchUserValidator.validate(request);
            expect(errors.length).toEqual(0);
        });
    });
});
