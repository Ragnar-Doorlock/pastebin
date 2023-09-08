const HttpPresenter = require('../httpPresenter');
const GetUserInteractor = require('./get-user/getUserInteractor');
const GetUserValidator = require('./get-user/getUserValidator');
const SearchUserInteractor = require('./search-users/searchUserInteractor');
const SearchUserValidator = require('./search-users/searchUserValidator');
const UpdateUserInteractor = require('./update-user/updateUserInteractor');
const UpdateUserValidator = require('./update-user/updateUserValidator');
const DeleteUserInteractor = require('./delete-user/deleteUserInteractor');
const DeleteUserValidator = require('./delete-user/deleteUserValidator');
const GetUserHttpRequest = require('./get-user/getUserHttpRequest');
const SearchUserHttpRequest = require('./search-users/searchUserHttpRequest');
const UpdateUserHttpRequest = require('./update-user/updateUserHttpRequest');
const DeleteUserHttpRequest = require('./delete-user/deleteUserHttpRequest');
const LoginValidator = require('./login/loginValidator');
const LoginInteractor = require('./login/loginInteractor');
const LoginHttpRequest = require('./login/loginHttpRequest');
const RegisterUserValidator = require('./register-user/registerUserValidator');
const RegisterUserInteractor = require('./register-user/registerUserInteractor');
const RegisterUserHttpRequest = require('./register-user/registerUserHttpRequest');
const auth = require('../authProvider');
const ApiError = require('../errors/apiError');

class UserRouterBuilder {
    constructor({
        express,
        userRepository,
        userFactory,
        idGenerator,
        getUserResponseBuilder,
        searchUserResponseBuilder,
        loginResponseBuilder,
        registerResponseBuilder,
        loggerProvider,
        passwordHashService,
        authTokenService
    }) {
        this.router = express.Router();
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.idGenerator = idGenerator;
        this.getUserResponseBuilder = getUserResponseBuilder;
        this.searchUserResponseBuilder = searchUserResponseBuilder;
        this.loginResponseBuilder = loginResponseBuilder;
        this.registerResponseBuilder = registerResponseBuilder;
        this.loggerProvider = loggerProvider;
        this.passwordHashService = passwordHashService;
        this.authTokenService = authTokenService;
    }

    createRoutes() {
        this.router.get('/:userId', auth, async (request, respone) => {
            const validator = new GetUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new GetUserInteractor({
                presenter,
                validator,
                userRepository: this.userRepository,
                responseBuilder: this.getUserResponseBuilder,
                loggerProvider: this.loggerProvider
            });

            try {
                await interactor.execute(new GetUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        this.router.post('/search-users', async (request, respone) => {
            const validator = new SearchUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new SearchUserInteractor({
                validator,
                userRepository: this.userRepository,
                presenter,
                responseBuilder: this.searchUserResponseBuilder
            });

            try {
                await interactor.execute(new SearchUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        this.router.put('/:userId', auth, async (request, respone) => {
            const validator = new UpdateUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new UpdateUserInteractor({
                validator,
                presenter,
                userFactory: this.userFactory,
                userRepository: this.userRepository,
                loggerProvider: this.loggerProvider
            });

            try {
                await interactor.execute(new UpdateUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        this.router.delete('/:userId', auth, async (request, respone) => {
            const validator = new DeleteUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new DeleteUserInteractor({
                validator,
                presenter,
                userRepository: this.userRepository,
                loggerProvider: this.loggerProvider
            });

            try {
                await interactor.execute(new DeleteUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        this.router.post('/register', async (request, response) => {
            const validator = new RegisterUserValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new RegisterUserInteractor({
                presenter,
                validator,
                userFactory: this.userFactory,
                userRepository: this.userRepository,
                idGenerator: this.idGenerator,
                passwordHashService: this.passwordHashService,
                loggerProvider: this.loggerProvider,
                responseBuilder: this.registerResponseBuilder,
                authTokenService: this.authTokenService
            });

            try {
                await interactor.execute(new RegisterUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        this.router.post('/login', async (request, response) => {
            const validator = new LoginValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new LoginInteractor({
                presenter,
                validator,
                userRepository: this.userRepository,
                passwordHashService: this.passwordHashService,
                responseBuilder: this.loginResponseBuilder,
                authTokenService: this.authTokenService
            });

            try {
                await interactor.execute(new LoginHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        return this.router;
    }
}

module.exports = UserRouterBuilder;
