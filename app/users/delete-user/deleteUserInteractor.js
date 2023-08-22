const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class DeleteUserInteractor {
    constructor({ validator, presenter, userRepository }) {
        this.validator = validator;
        this.presenter = presenter;
        this.userRepository = userRepository;
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

        await this.userRepository.delete(request.id);
        this.presenter.presentSuccess();
    }
}

module.exports = DeleteUserInteractor;
