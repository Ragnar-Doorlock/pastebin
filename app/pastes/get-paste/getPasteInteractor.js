const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const ForbiddenError = require('../../errors/forbidden');

class GetPasteInteractor {
    constructor({ presenter, validator, pasteRepository, responseBuilder, loggerProvider, pasteFactory }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
        this.logger = loggerProvider.create(GetPasteInteractor.name);
        this.pasteFactory = pasteFactory;
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

        if (paste.isPublic()) {
            this.presenter.presentSuccess(this.responseBuilder.build(paste));
            return;
        }

        if (request.userId !== paste.getAuthorId()) {
            this.presenter.presentFailure( new ForbiddenError('You don\'t have access to this paste.'));
            return;
        }

        const pasteEntity = this.pasteFactory.create({
            id: paste.getId(),
            name: paste.getName(),
            text: paste.getText(),
            visibility: paste.getVisibility(),
            authorId: paste.getAuthorId(),
            expiresAfter: paste.getExpiration(),
            totalViews: paste.getTotalViews() + 1
        });
        await this.pasteRepository.save(pasteEntity);

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetPasteInteractor;
