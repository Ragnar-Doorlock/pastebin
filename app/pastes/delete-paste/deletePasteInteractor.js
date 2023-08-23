const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class DeletePasteInteractor {
    constructor({ validator, presenter, pasteRepository, logger }) {
        this.validator = validator;
        this.presenter = presenter;
        this.pasteRepository = pasteRepository;
        this.logger = logger;
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

        await this.pasteRepository.delete(request.id);
        this.presenter.presentSuccess();
    }
}

module.exports = DeletePasteInteractor;
