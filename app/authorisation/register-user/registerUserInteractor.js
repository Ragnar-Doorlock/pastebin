const ApiError = require('../../errors/apiError');
const ValidationError = require('../../errors/validationError');

class RegisterUserInteractor {
    constructor({ presenter, validator, userRepository, userFactory, idGenerator, bcrypt, loggerProvider }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.idGenerator = idGenerator;
        this.bcrypt = bcrypt;
        this.logger = loggerProvider.create(RegisterUserInteractor.name);
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const login = await this.userRepository.findOne({ login: request.login });

        if (login) {
            // doesn't show error message
            this.presenter.presentFailure(new ApiError('This login already exists.'));
            return;
        }

        const saltRounds = 11;
        const securedPass = await this.bcrypt.hash(request.password, saltRounds);

        const user = this.userFactory.create({
            id: this.idGenerator.generate('user'),
            name: request.name,
            login: request.login,
            password: securedPass
        });

        await this.userRepository.save(user);

        this.presenter.presentSuccess();
    }
}

module.exports = RegisterUserInteractor;
