const ValidationError = require('../../errors/validationError');
const Forbidden = require('../../errors/forbidden');

class CreatePasteInteractor {
    constructor({ presenter, validator, pasteRepository, pasteFactory, idGenerator }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.pasteFactory = pasteFactory;
        this.idGenerator = idGenerator;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        if (request.user.id !== request.authorId) {
            // probably it's better to change error text
            this.presenter.presentFailure( new Forbidden('You can\'t create this paste.'));
            return;
        }

        const paste = this.pasteFactory.create({
            id: this.idGenerator.generate('paste'),
            name: request.name,
            text: request.text,
            visibility: request.visibility,
            expiresAfter: request.expiresAfter,
            authorId: request.authorId
        });
        await this.pasteRepository.save(paste);

        this.presenter.presentSuccess();
    }
}

module.exports = CreatePasteInteractor;
