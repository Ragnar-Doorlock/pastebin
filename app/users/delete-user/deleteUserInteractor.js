const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class DeleteUserInteractor {
    constructor ({validator, presenter, userRepository}) {
        this.validator = validator;
        this.presenter = presenter;
        this.userRepository = userRepository;
    }

    async execute({id}) {
        const errors = this.validator.validate(id);

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const user = await this.userRepository.findByID({id});

        if (!user) {
            this.presenter.presentFailure( new NotFound(`User with ${id} was not found`));
            return;
        }

        await this.userRepository.delete(id);
        this.presenter.presentSuccess();
    }
}

module.exports = DeleteUserInteractor;