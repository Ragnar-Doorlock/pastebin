const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const ForbiddenError = require('../../errors/forbidden');

class DeletePasteInteractor {
    constructor({ validator, presenter, pasteRepository, loggerProvider, pasteTextStorage }) {
        this.validator = validator;
        this.presenter = presenter;
        this.pasteRepository = pasteRepository;
        this.logger = loggerProvider.create(DeletePasteInteractor.name);
        this.textStorage = pasteTextStorage;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = await this.pasteRepository.findById({ id: request.id });

        if (!paste) {
            this.presenter.presentFailure(new NotFound(`Paste with ID ${request.id} was not found.`));
            this.logger.error(`Not found: Paste with ID ${request.id} was not found.`);
            return;
        }

        if (request.userId !== paste.getAuthorId()) {
            this.presenter.presentFailure( new ForbiddenError('You don\'t have access to this paste.'));
            return;
        }

        await this.pasteRepository.delete(request.id);
        await this.textStorage.deleteText(request.id);
        this.presenter.presentSuccess();
    }
}

module.exports = DeletePasteInteractor;
