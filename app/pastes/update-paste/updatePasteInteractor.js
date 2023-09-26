const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const ForbiddenError = require('../../errors/forbidden');

class UpdatePasteInteractor {
    constructor({ presenter, validator, pasteFactory, pasteRepository, loggerProvider }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteFactory = pasteFactory;
        this.pasteRepository = pasteRepository;
        this.logger = loggerProvider.create(UpdatePasteInteractor.name);
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

        paste.changeName(request.name);
        paste.changeText(request.text);
        paste.changeVisibility(request.visibility);
        await this.pasteRepository.save(paste);
        this.presenter.presentSuccess();
    }
}

module.exports = UpdatePasteInteractor;
