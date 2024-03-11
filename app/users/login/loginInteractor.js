const ValidationError = require('../../errors/validationError');
const NotFound = require('../../errors/notFound');
const ApiError = require('../../errors/apiError');

class LoginInteractor {
    constructor({
        presenter,
        validator,
        userRepository,
        passwordHashService,
        responseBuilder,
        authTokenService
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.passwordHashService = passwordHashService;
        this.responseBuilder = responseBuilder;
        this.authTokenService = authTokenService;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const user = await this.userRepository.findOne({ login: request.login });

        if (!user) {
            this.presenter.presentFailure(new NotFound('User does not exist.'));
            return;
        }

        const match = await this.passwordHashService.compare(request.password, user.getPassword());

        if (!match) {
            this.presenter.presentFailure(new ApiError({ message: 'Invalid password.' }));
            return;
        }

        const token = await this.authTokenService.sign({ id: user.getId() });

        this.presenter.presentSuccess(this.responseBuilder.build(token));
    }
}

module.exports = LoginInteractor;
