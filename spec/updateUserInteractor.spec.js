const UpdateUserInteractor = require('../app/users/update-user/updateUserInteractor');
const ForbiddenError = require('../app/errors/forbidden');
const NotFound = require('../app/errors/notFound');
const ValidationError = require('../app/errors/validationError');

describe('UpdateUserInteractor', () => {
    let presenter, validator, userFactory, userRepository, loggerProvider;
    let updateUserInteractor;
    let user;
    beforeEach(() => {
        presenter = jasmine.createSpyObj('presenter', ['presentSuccess', 'presentFailure']);
        validator = jasmine.createSpyObj('validator', ['validate']);
        userFactory = jasmine.createSpyObj('userFactory', ['create']);
        userRepository = jasmine.createSpyObj('userRepository', ['save', 'findByID']);
        loggerProvider = jasmine.createSpyObj('loggerProvider', ['create']);
        loggerProvider.create.and.returnValue({ error: jasmine.createSpy() });
        user = jasmine.createSpyObj('userEntity', ['changeName']);

        updateUserInteractor = new UpdateUserInteractor({
            presenter,
            validator,
            userFactory,
            userRepository,
            loggerProvider
        });
    });

    describe('execute()', () => {
        const id = '[fake-id]';
        const userId = '[fake-id]';
        const name = '[fake-name]';
        let request = {};
        beforeEach(() => {
            request = {
                id,
                name,
                userId
            };
            validator.validate.and.returnValue([]);
            userRepository.findByID.and.resolveTo(user);
        });

        it('should return error if validation failed', async () => {
            validator.validate.and.returnValue(['[fake-error]']);
            await updateUserInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ValidationError(['[fake-error]']));
        });

        it('should return error if ids do not match', async () => {
            const invalidId = '[fake-invalid-id]';
            request = {
                id,
                name,
                userId: invalidId
            };
            await updateUserInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ForbiddenError('Access denied.'));
        });

        it('should check if user exists', async () => {
            await updateUserInteractor.execute(request);
            expect(userRepository.findByID).toHaveBeenCalledWith({ id: request.id });
        });

        it('should return error if user was not found', async () => {
            userRepository.findByID.and.resolveTo(null);
            await updateUserInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new NotFound(`User ${request.id} was not found.`));
        });

        it('should change name in user entity', async () => {
            await updateUserInteractor.execute(request);
            expect(user.changeName).toHaveBeenCalledWith(request.name);
        });

        it('should save user changes', async () => {
            await updateUserInteractor.execute(request);
            expect(userRepository.save).toHaveBeenCalledWith(user);
        });

        it('should send successful response', async () => {
            await updateUserInteractor.execute(request);
            expect(presenter.presentSuccess).toHaveBeenCalled();
        });
    });
});
