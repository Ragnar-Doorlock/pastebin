const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class GetPasteInteractor {
    constructor({ presenter, validator, pasteRepository, responseBuilder, loggerProvider }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
        this.logger = loggerProvider.create(GetPasteInteractor.name);
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const paste = await this.pasteRepository.findById({ id: request.id });

        if (!paste) {
            this.presenter.presentFailure( new NotFound(`Paste with ${request.id} was not found.`));
            this.logger.error(`Not found: Paste with ID ${request.id} was not found.`);
            return;
        }

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetPasteInteractor;
