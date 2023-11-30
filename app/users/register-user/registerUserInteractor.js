const ValidationError = require('../../errors/validationError');
const ApiError = require('../../errors/apiError');

class RegisterUserInteractor {
    constructor({
        presenter,
        validator,
        userRepository,
        userFactory,
        idGenerator,
        passwordHashService,
        loggerProvider,
        responseBuilder,
        authTokenService
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.idGenerator = idGenerator;
        this.passwordHashService = passwordHashService;
        this.logger = loggerProvider.create(RegisterUserInteractor.name);
        this.responseBuilder = responseBuilder;
        this.authTokenService = authTokenService;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const login = await this.userRepository.findOne({ login: request.login });

        if (login) {
            this.presenter.presentFailure(new ApiError({ message: `User ${request.login} already exists.` }));
            return;
        }

        const securedPass = await this.passwordHashService.hash(request.password);
        const generatedId = this.idGenerator.generate('user');
        const user = this.userFactory.create({
            id: generatedId,
            name: request.name,
            login: request.login,
            password: securedPass
        });

        await this.userRepository.save(user);

        const token = await this.authTokenService.sign({ id: generatedId });
        user.setToken(token);

        this.presenter.presentSuccess(this.responseBuilder.build(user));
    }
}

module.exports = RegisterUserInteractor;
