const GetUserInteractor = require('../../../app/users/get-user/getUserInteractor');
const ValidationError = require('../../../app/errors/validationError');
const NotFound = require('../../../app/errors/notFound');

describe('GetUserInteractor', () => {
    let presenter, validator, userRepository, responseBuilder, loggerProvider;
    let logger;
    let getUserInteractor;

    beforeEach(() => {
        presenter = jasmine.createSpyObj('presenter', ['presentSuccess', 'presentFailure']);
        validator = jasmine.createSpyObj('validator', ['validate']);
        userRepository = jasmine.createSpyObj('userRepository', ['findByID']);
        responseBuilder = jasmine.createSpyObj('responseBuilder', ['build']);
        loggerProvider = jasmine.createSpyObj('loggerProvider', ['create']);
        logger = jasmine.createSpyObj('logger', ['error']);
        loggerProvider.create.and.returnValue(logger);

        getUserInteractor = new GetUserInteractor({
            presenter,
            validator,
            userRepository,
            responseBuilder,
            loggerProvider
        });
    });

    describe('execute()', () => {
        const id = '[fake-id]';
        const name = '[fake-name]';
        const pastesCreated = '[fake-amount]';
        let request = {};
        let user = {};
        beforeEach(() => {
            request = {
                id
            };
            validator.validate.and.returnValue([]);
            userRepository.findByID.and.resolveTo(user);
            user = {
                name,
                pastesCreated
            };
        });

        it('should throw error if validation failed', async () => {
            validator.validate.and.returnValue(['[fake-error]']);
            await getUserInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ValidationError(['[fake-error]']));
        });

        it('should find user by id', async () => {
            await getUserInteractor.execute(request);
            expect(userRepository.findByID).toHaveBeenCalledWith(request);
        });

        it('should throw error if user was not found', async () => {
            userRepository.findByID.and.resolveTo(null);
            await getUserInteractor.execute(request);
            expect(logger.error).toHaveBeenCalledWith('Not found: User with ID [fake-id] was not found.');
            expect(presenter.presentFailure).toHaveBeenCalledWith(new NotFound('User with [fake-id] was not found'));
        });

        it('should response with found user', async () => {
            await getUserInteractor.execute(request);
            expect(presenter.presentSuccess).toHaveBeenCalledWith(responseBuilder.build(user));
        });
    });
});
