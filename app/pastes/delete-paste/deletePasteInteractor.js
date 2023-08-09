const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class DeletePasteInteractor {
    constructor ({validator, presenter, pasteRepository}) {
        this.validator = validator;
        this.presenter = presenter;
        this.pasteRepository = pasteRepository;
    }

    async execute({id}) {
        const errors = this.validator.validate({id});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = await this.pasteRepository.findById({id});

        if (!paste) {
            this.presenter.presentFailure(new NotFound(`Paste with ID ${id} was not found.`));
            return;
        }

        await this.pasteRepository.delete(id);
        this.presenter.presentSuccess();
    }
}

module.exports = DeletePasteInteractor;