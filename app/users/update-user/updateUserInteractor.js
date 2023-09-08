const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const ForbiddenError = require('../../errors/forbidden');

class UpdateUserInteractor {
    constructor({ presenter, validator, userFactory, userRepository, loggerProvider }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userFactory = userFactory;
        this.userRepository = userRepository;
        this.logger = loggerProvider.create(UpdateUserInteractor.name);
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        if (request.id !== request.userId) {
            this.presenter.presentFailure( new ForbiddenError('Access denied.') );
            return;
        }

        const user = await this.userRepository.findByID({ id: request.id });

        if (!user) {
            this.presenter.presentFailure(new NotFound(`User ${request.id} was not found.`));
            this.logger.error(`Not found: User with ID ${request.id} was not found.`);
            return;
        }

        const userEntity = this.userFactory.create({ id: request.id, name: request.name, password: user.getPassword() });
        await this.userRepository.save(userEntity);
        this.presenter.presentSuccess();
    }
}

module.exports = UpdateUserInteractor;
