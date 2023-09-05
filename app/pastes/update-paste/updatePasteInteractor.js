const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const Forbidden = require('../../errors/forbidden');

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

        if (request.user.id !== paste.getAuthorId()) {
            this.presenter.presentFailure( new Forbidden('You don\'t have access to this paste.'));
            return;
        }

        const pasteEntity = this.pasteFactory.create({
            id: request.id,
            name: request.name,
            text: request.text,
            visibility: request.visibility,
            authorId: paste.getAuthorId(),
            expiresAfter: new Date(paste.getExpiration()).toUTCString()
        });
        await this.pasteRepository.save(pasteEntity);
        this.presenter.presentSuccess();
    }
}

module.exports = UpdatePasteInteractor;
