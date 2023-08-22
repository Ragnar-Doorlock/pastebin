const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class GetUserInteractor {
    constructor({ presenter, validator, userRepository, responseBuilder }) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const user = await this.userRepository.findByID({ id: request.id });

        if (!user) {
            this.presenter.presentFailure( new NotFound(`User with ${request.id} was not found`));
            return;
        }

        this.presenter.presentSuccess(this.responseBuilder.build(user));
    }
}

module.exports = GetUserInteractor;
