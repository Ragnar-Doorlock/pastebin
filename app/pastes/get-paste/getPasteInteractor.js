const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const Forbidden = require('../../errors/forbidden');

class GetPasteInteractor {
    constructor({ presenter, validator, pasteRepository, responseBuilder, loggerProvider, jwt }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
        this.logger = loggerProvider.create(GetPasteInteractor.name);
        this.jwt = jwt;
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

        if (request.user.id !== paste._authorId) {
            // eslint-disable-next-line quotes
            this.presenter.presentFailure( new Forbidden(`You don't have permission to access this paste.`));
            return;
        }

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetPasteInteractor;
