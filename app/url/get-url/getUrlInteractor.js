const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class GetUrlInteractor {
    constructor ({presenter, validator, urlRepository, responseBuilder}) {
        this.validator = validator;
        this.presenter = presenter;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const url = await this.urlRepository.findById({pasteId: request.pasteId});

        if (!url) {
            this.presenter.presentFailure(new NotFound(`Url hash with paste ID ${request.pasteId} was not found.`));
            return;
        }

        this.presenter.presentSuccess(this.responseBuilder.build(url));
    }
}

module.exports = GetUrlInteractor;