const { ValidationError } = require('sequelize');
const NotFound = require('../../errors/notFound');
const ValidatiotError = require('../../errors/validationError');

class CreateUrlInteractor {
    constructor ({presenter, validator, urlRepository, urlFactory}) {
        this.presenter = presenter;
        this.validator = validator;
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
    }

    async execute({pasteId, hash}) {
        // i'm validating only pasteId since hash is going to be generated
        const errors = this.validator.validate({pasteId});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const url = this.urlFactory.create({pasteId, hash});
        await this.urlRepository.createHash(url);

        this.presenter.presentSuccess();
    }
}

module.exports = CreateUrlInteractor;