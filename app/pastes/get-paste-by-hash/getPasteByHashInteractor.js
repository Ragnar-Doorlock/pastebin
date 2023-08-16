const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class GetPasteByHashInteractor {
    constructor ({presenter, validator, pasteRepository, urlRepository, responseBuilder, pasteFactory}) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
        this.pasteFactory = pasteFactory;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const url = await this.urlRepository.findOne({hash: request.hash});

        if (!url) {
            this.presenter.presentFailure(new NotFound(`No pastes with '${(request.hash).substring(0, 20).concat('...')}' hash`));
            return;
        }

        const paste = await this.pasteRepository.findById({id: url._pasteId});

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetPasteByHashInteractor;