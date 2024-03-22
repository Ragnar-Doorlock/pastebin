const GetUserInteractor = require('../app/users/get-user/getUserInteractor');

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
            user = {
                name,
                pastesCreated
            };
        });

        it('should validate id', () => {
            validatorMock.validate.and.returnValue([]);
        });

        it('should response with found user', async () => {
            //validatorMock.validate.and.returnValue([]);
            userRepositoryMock.findByID.and.resolveTo(user);
            await getUserInteractor.execute(request);
            expect(presenterMock.presentSuccess).toHaveBeenCalledWith(responseBuilderMock.build(user));
        });
    });
});
