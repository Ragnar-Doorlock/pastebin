const GetUserInteractor = require('../app/users/get-user/getUserInteractor');
const ValidationError = require('../app/errors/validationError');
const NotFound = require('../app/errors/notFound');

describe('getUserInteractor()', () => {
    let presenterMock, validatorMock, userRepositoryMock, responseBuilderMock, loggerProviderMock;
    let getUserInteractor;

    beforeEach(() => {
        presenterMock = jasmine.createSpyObj('presenter', ['presentSuccess', 'presentFailure']);
        validatorMock = jasmine.createSpyObj('validator', ['validate']);
        userRepositoryMock = jasmine.createSpyObj('userRepository', ['findByID']);
        responseBuilderMock = jasmine.createSpyObj('responseBuilder', ['build']);
        loggerProviderMock = jasmine.createSpyObj('loggerProvider', ['create']);

        getUserInteractor = new GetUserInteractor({
            presenter: presenterMock,
            validator: validatorMock,
            userRepository: userRepositoryMock,
            responseBuilder: responseBuilderMock,
            loggerProvider: loggerProviderMock
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
            validatorMock.validate.and.returnValue([]);
            userRepositoryMock.findByID.and.resolveTo(user);
            user = {
                name,
                pastesCreated
            };
        });

        it('should throw error if validation failed', async () => {
            await getUserInteractor.execute(request);
            validatorMock.validate.and.returnValue(['fake-error']);
            expect(presenterMock.presentFailure).toHaveBeenCalledWith(new ValidationError('[fake-error]'));
        });

        it('should find user by id', async () => {
            await getUserInteractor.execute(request);
            expect(userRepositoryMock.findByID).toHaveBeenCalledWith(request);
        });

        xit('should throw error if user was not found', async () => {
            await getUserInteractor.execute(request);
            expect(userRepositoryMock.findByID).toHaveBeenCalledWith(request);
            userRepositoryMock.findByID.and.resolveTo(null);
            expect(presenterMock.presentFailure).toHaveBeenCalledWith(new NotFound('User with [fake-id] was not found'));
        });

        it('should response with found user', async () => {
            await getUserInteractor.execute(request);
            expect(presenterMock.presentSuccess).toHaveBeenCalledWith(responseBuilderMock.build(user));
        });
    });
});
