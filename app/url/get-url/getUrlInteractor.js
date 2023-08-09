const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const GetUserValidator = require('../../users/get-user/getUserValidator');

class GetUrlInteractor {
    constructor ({presenter, validator, urlRepository, responseBuilder}) {
        this.validator = validator;
        this.presenter = presenter;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute({pasteId}) {
        const errors = this.validator.validate({pasteId});

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const url = await this.urlRepository.findById({pasteId});

        if (!url) {
            this.presenter.presentFailure(new NotFound(`Url hash with paste ID ${pasteId} was not found.`));
            return;
        }

        this.presenter.presentSuccess(this.responseBuilder.build(url));
    }
}

module.exports = GetUrlInteractor;