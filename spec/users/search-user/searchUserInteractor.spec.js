const SearchUserInteractor = require('../../../app/users/search-users/searchUserInteractor');
const ValidationError = require('../../../app/errors/validationError');

describe('SearchUserInteractor', () => {
    let userRepository, presenter, validator, responseBuilder;
    let searchUserInteractor;
    beforeEach(() => {
        userRepository = jasmine.createSpyObj('userRepository', ['findAll']);
        presenter = jasmine.createSpyObj('presenter', ['presentSuccess', 'presentFailure']);
        validator = jasmine.createSpyObj('validator', ['validate']);
        responseBuilder = jasmine.createSpyObj('responseBuilder', ['build']);

        searchUserInteractor = new SearchUserInteractor({
            userRepository,
            presenter,
            validator,
            responseBuilder
        });
    });

    describe('execute()', () => {
        const id = '[fake-id]';
        const name = '[fake-name]';
        const login = '[fake-login]';
        let request = {};
        beforeEach(() => {
            request = {
                id,
                name
            };
            validator.validate.and.returnValue([]);
            userRepository.findAll.and.resolveTo([{
                id,
                name,
                login
            }]);
        });

        it('should return error if validation failed', async () => {
            validator.validate.and.returnValue(['[fake-error]']);
            await searchUserInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ValidationError(['[fake-error]']));
        });

        it('should search for user by id and name', async () => {
            await searchUserInteractor.execute(request);
            expect(userRepository.findAll).toHaveBeenCalledWith({ ids: [request.id], name: request.name });
        });

        it('should search for user by [id] and name', async () => {
            request = {
                id: [id],
                name
            };
            await searchUserInteractor.execute(request);
            expect(userRepository.findAll).toHaveBeenCalledWith({ ids: request.id, name: request.name });
        });

        it('should search for user by id', async () => {
            request = {
                id
            };
            await searchUserInteractor.execute(request);
            expect(userRepository.findAll).toHaveBeenCalledWith({ ids: [request.id], name: undefined });
        });

        it('should search for user by name', async () => {
            request = {
                name
            };
            await searchUserInteractor.execute(request);
            expect(userRepository.findAll).toHaveBeenCalledWith({ ids: [undefined], name: request.name });
        });

        it('should build response', async () => {
            await searchUserInteractor.execute(request);
            expect(responseBuilder.build).toHaveBeenCalledWith([{
                id,
                name,
                login
            }]);
        });

        it('should response with found user', async () => {
            const builtResponse = { fake: 'response' };
            responseBuilder.build.and.returnValue(builtResponse);
            await searchUserInteractor.execute(request);
            expect(presenter.presentSuccess).toHaveBeenCalledWith(builtResponse);
        });

        it('should response with empty array if no user was found', async () => {
            userRepository.findAll.and.resolveTo([]);
            await searchUserInteractor.execute(request);
            expect(presenter.presentSuccess).toHaveBeenCalledWith(responseBuilder.build([]));
        });
    });
});
