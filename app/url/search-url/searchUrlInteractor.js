const ValidationError = require('../../errors/validationError');

class SearchUrlInteractor {
    constructor ({validator, presenter, urlRepository, responseBuilder}) {
        this.validator = validator;
        this.presenter = presenter;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute({pasteId, hash}) {
        const errors = this.validator.validate({pasteId, hash});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const pasteIds = Array.isArray(pasteId) ? pasteId : [pasteId];
        const urls = await this.urlRepository.findAll({pasteIds, hash});

        this.presenter.presentSuccess(this.responseBuilder.build(urls));
    }
}

module.exports = SearchUrlInteractor;