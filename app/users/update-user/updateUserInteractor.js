const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const Forbidden = require('../../errors/forbidden');

class UpdateUserInteractor {
    constructor({ presenter, validator, userFactory, userRepository, loggerProvider, bcrypt }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userFactory = userFactory;
        this.userRepository = userRepository;
        this.logger = loggerProvider.create(UpdateUserInteractor.name);
        this.bcrypt = bcrypt;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        if (request.id !== request.user.id) {
            this.presenter.presentFailure( new Forbidden('Access denied.') );
            return;
        }

        const user = await this.userRepository.findByID({ id: request.id });

        if (!user) {
            this.presenter.presentFailure(new NotFound(`User ${request.id} was not found.`));
            this.logger.error(`Not found: User with ID ${request.id} was not found.`);
            return;
        }

        let password;
        if (!request.password) {
            password = user.getPassword();
        } else {
            const SALT_ROUNDS = 11;
            password = await this.bcrypt.hash(request.password, SALT_ROUNDS);
        }

        const userEntity = this.userFactory.create({ id: request.id, name: request.name, password });
        await this.userRepository.save(userEntity);
        this.presenter.presentSuccess();
    }
}

module.exports = UpdateUserInteractor;
