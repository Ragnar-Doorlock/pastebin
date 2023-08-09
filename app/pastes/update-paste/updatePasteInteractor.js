const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class UpdatePasteInteractor {
    constructor ({presenter, validator, pasteFactory, pasteRepository}) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteFactory = pasteFactory;
        this.pasteRepository = pasteRepository;
    }

    async execute({id, name, text, visibility}) {
        const errors = this.validator.validate({id, name, text, visibility});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = await this.pasteRepository.findById({id});

        if (!paste) {
            this.presenter.presentFailure(new NotFound(`Paste with ID ${id} was not found.`));
            return;
        }

        // if the expiration day should be edatable then pass here expiration date from request
        const pasteEntity = this.pasteFactory.create({id, name, text, visibility, authorId: paste.getAuthorId(), expiresAfter: new Date(paste.getExpiration()).toUTCString()});
        await this.pasteRepository.save(pasteEntity);
        this.presenter.presentSuccess();
    }
}

module.exports = UpdatePasteInteractor;