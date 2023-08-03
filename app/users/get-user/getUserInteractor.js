const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class GetUserInteractor {
    constructor ({presenter, validator, userRepository}) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
    }

    async execute({id}) {
        const errors = this.validator.validate({id});

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const user = await this.userRepository.findByID({id});

        if (!user) {
            this.presenter.presentFailure( new NotFound(`User with ${id} was not found`));
            return;
        }

        this.presenter.presentSuccess(user);
    }
}

module.exports = GetUserInteractor;