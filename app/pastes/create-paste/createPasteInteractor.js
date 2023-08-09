const ValidationError = require('../../errors/validationError');

class CreatePasteInteractor {
    constructor ({presenter, validator, pasteRepository, pasteFactory, idGenerator}) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.pasteFactory = pasteFactory;
        this.idGenerator = idGenerator;
    }

    async execute({name, text, visibility, expiresAfter, authorId}) {
        const errors = this.validator.validate({name, text, visibility, expiresAfter, authorId});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = this.pasteFactory.create({id: this.idGenerator.generate('paste'), name, text, visibility, expiresAfter, authorId});
        await this.pasteRepository.save(paste);

        this.presenter.presentSuccess();
    }
}

module.exports = CreatePasteInteractor;