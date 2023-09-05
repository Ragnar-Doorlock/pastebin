const HttpPresenter = require('../httpPresenter');
const RegisterUserValidator = require('../authorisation/register-user/registerUserValidator');
const RegisterUserInteractor = require('../authorisation/register-user/registerUserInteractor');
const RegisterUserHttpRequest = require('../authorisation/register-user/registerUserHttpRequest');
const LoginHttpRequest = require('./login/loginHttpRequest');
const LoginValidator = require('./login/loginValidator');
const LoginInteractor = require('./login/loginInteractor');

class AuthRouterBuilder {
    constructor({
        express,
        jwt,
        userFactory,
        userRepository,
        loggerProvider,
        loginResponseBuilder,
        registerResponseBuilder,
        bcrypt,
        idGenerator
    }) {
        this.router = express.Router();
        this.jwt = jwt;
        this.userFactory = userFactory;
        this.userRepository = userRepository;
        this.loggerProvider = loggerProvider;
        this.loginResponseBuilder = loginResponseBuilder;
        this.registerResponseBuilder = registerResponseBuilder;
        this.bcrypt = bcrypt;
        this.idGenerator = idGenerator;
    }

    createRoutes() {
        this.router.post('/register', async (request, response) => {
            const validator = new RegisterUserValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new RegisterUserInteractor({
                presenter,
                validator,
                userFactory: this.userFactory,
                userRepository: this.userRepository,
                idGenerator: this.idGenerator,
                bcrypt: this.bcrypt,
                loggerProvider: this.loggerProvider,
                responseBuilder: this.registerResponseBuilder,
                jwt: this.jwt
            });

            try {
                await interactor.execute(new RegisterUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/login', async (request, response) => {
            const validator = new LoginValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new LoginInteractor({
                presenter,
                validator,
                userRepository: this.userRepository,
                bcrypt: this.bcrypt,
                responseBuilder: this.loginResponseBuilder,
                jwt: this.jwt
            });

            try {
                await interactor.execute(new LoginHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        return this.router;
    }
}

module.exports = AuthRouterBuilder;
