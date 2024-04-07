const LoginInteractor = require('../../../app/users/login/loginInteractor');
const ValidationError = require('../../../app/errors/validationError');
const ApiError = require('../../../app/errors/apiError');
const NotFound = require('../../../app/errors/notFound');

describe('LoginInteractor', () => {
    let presenter, validator, userRepository, passwordHashService, responseBuilder, authTokenService;
    let loginInteractor;
    beforeEach(() => {
        presenter = jasmine.createSpyObj('presenter', ['presentSuccess', 'presentFailure']);
        validator = jasmine.createSpyObj('validator', ['validate']);
        userRepository = jasmine.createSpyObj('userRepository', ['findOne']);
        passwordHashService = jasmine.createSpyObj('passwordHashService', ['compare']);
        responseBuilder = jasmine.createSpyObj('responseBuilder', ['build']);
        authTokenService = jasmine.createSpyObj('authTokenService', ['sign']);

        loginInteractor = new LoginInteractor({
            presenter,
            validator,
            userRepository,
            passwordHashService,
            responseBuilder,
            authTokenService
        });
    });

    describe('execute()', () => {
        const login = '[fake-login]';
        const id = '[fake-id]';
        const password = '[fake-password]';
        const hashedPassword = '[fake-hashed-password]';
        const token = '[fake-token]';
        let request = {};
        let user = {};
        beforeEach(() => {
            user = jasmine.createSpyObj('user', ['getId', 'getPassword']);
            request = {
                login,
                password
            };
            validator.validate.and.returnValue([]);
            user.getPassword.and.returnValue(hashedPassword);
            user.getId.and.returnValue(id);
            userRepository.findOne.and.resolveTo(user);
            passwordHashService.compare.and.resolveTo(true);
            authTokenService.sign.and.resolveTo(token);
            responseBuilder.build.and.returnValue({ accessToken: token });
        });

        it('should return error if validation failed', async () => {
            validator.validate.and.returnValue(['[fake-error]']);
            await loginInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ValidationError(['[fake-error]']));
        });

        it('should check if user exists in database', async () => {
            await loginInteractor.execute(request);
            expect(userRepository.findOne).toHaveBeenCalledWith({ login: request.login });
        });

        it('should return error if user does not exist in db', async () => {
            userRepository.findOne.and.resolveTo(null);
            await loginInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new NotFound('User does not exist.'));
        });

        it('should check if request password matches with hashed password', async () => {
            await loginInteractor.execute(request);
            expect(user.getPassword).toHaveBeenCalled();
            expect(passwordHashService.compare).toHaveBeenCalledWith(password, hashedPassword);
        });

        it('should return error if passwords do not match', async () => {
            passwordHashService.compare.and.resolveTo(false);
            await loginInteractor.execute(request);
            expect(presenter.presentFailure).toHaveBeenCalledWith(new ApiError({ message: 'Invalid password.' }));
        });

        it('should generate token', async () => {
            await loginInteractor.execute(request);
            expect(user.getId).toHaveBeenCalled();
            expect(authTokenService.sign).toHaveBeenCalledWith({ id });
        });

        it('should build response', async () => {
            await loginInteractor.execute(request);
            expect(responseBuilder.build).toHaveBeenCalledWith(token);
        });

        it('should return built response', async () => {
            const builtResponse = { accessToken: token };
            responseBuilder.build.and.returnValue(builtResponse);
            await loginInteractor.execute(request);
            expect(presenter.presentSuccess).toHaveBeenCalledWith(builtResponse);
        });
    });
});
