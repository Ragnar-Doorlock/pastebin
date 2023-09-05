const ValidationError = require('../../errors/validationError');
const ApiError = require('../../errors/apiError');

class RegisterUserInteractor {
    constructor({
        presenter,
        validator,
        userRepository,
        userFactory,
        idGenerator,
        bcrypt,
        loggerProvider,
        responseBuilder,
        jwt
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.idGenerator = idGenerator;
        this.bcrypt = bcrypt;
        this.logger = loggerProvider.create(RegisterUserInteractor.name);
        this.responseBuilder = responseBuilder;
        this.jwt = jwt;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const login = await this.userRepository.findOne({ login: request.login });

        if (login) {
            //this.logger.info(login.getLogin());
            this.presenter.presentFailure(new ApiError({ message: `User ${request.login} already exists.` }));
            return;
        }

        const SALT_ROUNDS = 11;
        const securedPass = await this.bcrypt.hash(request.password, SALT_ROUNDS);

        const generatedId = this.idGenerator.generate('user');
        const user = this.userFactory.create({
            id: generatedId,
            name: request.name,
            login: request.login,
            password: securedPass
        });

        await this.userRepository.save(user);

        const token = this.jwt.sign(
            {
                id: generatedId
            },
            process.env.SECRET_KEY,
            {
                expiresIn: process.env.DEFAULT_ACCESS_TOKEN_EXPIRES_AFTER_HOURS
            }
        );

        this.presenter.presentSuccess(this.responseBuilder.build(token));
    }
}

module.exports = RegisterUserInteractor;
