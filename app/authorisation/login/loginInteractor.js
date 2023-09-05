const ValidationError = require('../../errors/validationError');
const NotFound = require('../../errors/notFound');
const ApiError = require('../../errors/apiError');

class LoginInteractor {
    constructor({
        presenter,
        validator,
        userRepository,
        bcrypt,
        responseBuilder,
        jwt
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.bcrypt = bcrypt;
        this.responseBuilder = responseBuilder;
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
            this.presenter.presentFailure(new NotFound('User does not exist.'));
            return;
        }

        const match = await this.bcrypt.compare(request.password, user.getPassword());

        if (!match) {
            this.presenter.presentFailure(new ApiError({ message: 'Invalid password.' }));
            return;
        }

        const token = this.jwt.sign(
            {
                id: user._id
            },
            process.env.SECRET_KEY,
            {
                expiresIn: process.env.DEFAULT_ACCESS_TOKEN_EXPIRES_AFTER_HOURS
            }
        );

        this.presenter.presentSuccess(this.responseBuilder.build(token));
    }
}

module.exports = LoginInteractor;
