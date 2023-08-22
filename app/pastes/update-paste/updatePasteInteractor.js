const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class UpdatePasteInteractor {
    constructor({ presenter, validator, pasteFactory, pasteRepository }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteFactory = pasteFactory;
        this.pasteRepository = pasteRepository;
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
            return;
        }

        // if the expiration day should be editable then pass here expiration date from request
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
