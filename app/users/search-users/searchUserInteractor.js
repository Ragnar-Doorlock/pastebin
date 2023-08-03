const ValidationError = require('../../errors/validationError');
const NotFound = require('../../errors/notFound');

class SearchUserInteractor {
    constructor ({userRepository, validator, presenter}) {
        this.userRepository = userRepository;
        this.validator = validator;
        this.presenter = presenter;
    }

    async execute({id, name}) {
        const errors = this.validator.validate({id, name});
        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        let users;

        if (Array.isArray(id)) {
            users = await this.userRepository.findAll({ids: id, name});
        } else {
            users = await this.userRepository.findAll({ids: [id], name});
        }

        if (users.length === 0) {
            this.presenter.presentFailure(new NotFound('No results.'));
            return;
        }

        this.presenter.presentSuccess(users);
    }
}

module.exports = SearchUserInteractor;