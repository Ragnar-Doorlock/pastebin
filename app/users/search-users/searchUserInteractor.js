const ValidationError = require('../../errors/validationError');
const NotFound = require('../../errors/notFound');

class SearchUserInteractor {
    constructor ({userRepository, validator, presenter, responseBuilder}) {
        this.userRepository = userRepository;
        this.validator = validator;
        this.presenter = presenter;
        this.responseBuilder = responseBuilder;
    }

    async execute({id, name}) {
        const errors = this.validator.validate({id, name});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const userID = Array.isArray(id) ? id : [id];
        const users = await this.userRepository.findAll({ids: userID, name});

        this.presenter.presentSuccess(this.responseBuilder.build(users));
    }
}

module.exports = SearchUserInteractor;