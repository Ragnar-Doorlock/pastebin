const ValidationError = require('../../errors/validationError');
const NotFound = require('../../errors/notFound');
const ApiError = require('../../errors/apiError');
const DEFAULT_TOKEN_EXPIRES_AFTER_HOURS= '24 h';

class LoginInteractor {
    constructor({
        presenter,
        validator,
        userRepository,
        bcrypt,
        loginResponseBuilder,
        jwt
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.bcrypt = bcrypt;
        this.responseBuilder = loginResponseBuilder;
        this.jwt = jwt;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const user = await this.userRepository.findOne({ login: request.login });

        if (!user) {
            this.presenter.presentFailure(new NotFound('Login does not exist.'));
            return;
        }

        const match = await this.bcrypt.compare(request.password, user._password);

        if (!match) {
            this.presenter.presentFailure(new ApiError('Invalid password.'));
            return;
        }

        const token = this.jwt.sign(
            {
                id: user._id
            },
            process.env.SECRET_KEY,
            {
                expiresIn: DEFAULT_TOKEN_EXPIRES_AFTER_HOURS
            }
        );

        // not really sure if we need response builder, inside it looks like 'take token and return it immidiately'
        this.presenter.presentSuccess(this.responseBuilder.build(token));
    }
}

module.exports = LoginInteractor;
