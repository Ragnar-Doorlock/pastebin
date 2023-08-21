const ValidationError = require('../../errors/validationError');

class SearchUrlInteractor {
    constructor ({validator, presenter, urlRepository, responseBuilder}) {
        this.validator = validator;
        this.presenter = presenter;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const pasteIds = Array.isArray(request.pasteId) ? request.pasteId : [request.pasteId];
        const urls = await this.urlRepository.findAll({pasteIds, hash: request.hash});

        this.presenter.presentSuccess(this.responseBuilder.build(urls));
    }
}

module.exports = SearchUrlInteractor;