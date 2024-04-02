const RegisterUserInteractor = require('../app/users/register-user/registerUserInteractor');
const ValidationError = require('../app/errors/validationError');
const ApiError = require('../app/errors/apiError');

describe('RegisterUserInteractor', () => {
    let presenter, validator, userRepository, userFactory, idGenerator, passwordHashService;
    let loggerProvider, responseBuilder, authTokenService;
    let registerUserInteractor;
    beforeEach(() => {
        presenter = jasmine.createSpyObj('presenter', ['presentSuccess', 'presentFailure']);
        validator = jasmine.createSpyObj('validator', ['validate']);
        userRepository = jasmine.createSpyObj('userRepository', ['findOne', 'save']);
        userFactory = jasmine.createSpyObj('userFactory', ['create']);
        responseBuilder = jasmine.createSpyObj('responseBuilder', ['build']);
        loggerProvider = jasmine.createSpyObj('loggerProvider', ['create']);
        loggerProvider.create.and.returnValue({ error: jasmine.createSpy() });
        idGenerator = jasmine.createSpyObj('idGenerator', ['generate']);
        passwordHashService = jasmine.createSpyObj('passwordHashService', ['hash']);
        authTokenService = jasmine.createSpyObj('authTokenService', ['sign']);

        registerUserInteractor = new RegisterUserInteractor({
            presenter,
            validator,
            userRepository,
            userFactory,
            idGenerator,
            passwordHashService,
            loggerProvider,
            responseBuilder,
            authTokenService
        });
    });

    describe('execute()', () => {
        const name = '[fake-name]';
        const login = '[fake-login]';
        const password = '[fake-password]';
        const generatedId = '[fake-id]';
        const securedPass = '[fake-hashed-password]';
        const token = '[fake-token]';
        let request = {};
        beforeEach(() => {
            request = {
                name,
                login,
                password
            };
            validator.validate.and.returnValue([]);
            userRepository.findOne.and.resolveTo(null);
            idGenerator.generate.and.returnValue(generatedId);
            passwordHashService.hash.and.returnValue(securedPass);
        });

        it('should throw error if validation failed', async () => {
            validator.validate.and.returnValue(['[fake-error]']);
            await registerUserInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ValidationError(['[fake-error]']));
        });

        it('should check if login already exists', async () => {
            await registerUserInteractor.execute(request);
            expect(userRepository.findOne).toHaveBeenCalledWith({ login: request.login });
        });

        it('should return error if login is already taken', async () => {
            userRepository.findOne.and.resolveTo(login);
            await registerUserInteractor.execute(request);
            expect(userRepository.findOne).toHaveBeenCalledWith({ login: request.login });
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ApiError({ message: `User ${request.login} already exists.` }));
        });

        it('should hash password from request', async () => {
            await registerUserInteractor.execute(request);
            expect(passwordHashService.hash).toHaveBeenCalledWith(request.password);
        });

        it('should generate id for user', async () => {
            await registerUserInteractor.execute(request);
            expect(idGenerator.generate).toHaveBeenCalledWith('user');
        });

        it('should create user using userFactory', async () => {
            //idGenerator.generate.and.returnValue(generatedId);
            //passwordHashService.hash.and.returnValue(securedPass);
            await registerUserInteractor.execute(request);
            expect(userFactory.create).toHaveBeenCalledOnceWith({
                id: generatedId,
                name: request.name,
                login: request.login,
                password: securedPass
            });
        });

        it('should save user to database', async () => {
            userFactory.create.and.returnValue({
                id: generatedId,
                name: request.name,
                login: request.login,
                password: securedPass
            });
            await registerUserInteractor.execute(request);
            expect(userRepository.save).toHaveBeenCalledWith({
                id: generatedId,
                name: request.name,
                login: request.login,
                password: securedPass
            });
        });

        it('should generate token based on generated id', async () => {
            await registerUserInteractor.execute(request);
            expect(authTokenService.sign).toHaveBeenCalledWith({ id: generatedId });
        });

        it('should response with token', async () => {
            await registerUserInteractor.execute(request);
            expect(presenter.presentSuccess).toHaveBeenCalledWith(responseBuilder.build(token));
        });
    });
});
