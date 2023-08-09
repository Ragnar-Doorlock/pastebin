const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class DeleteUrlInteractor {
    constructor ({validator, presenter, urlRepository}) {
        this.presenter = presenter;
        this.validator = validator;
        this.urlRepository = urlRepository;
    }

    async execute({pasteId}) {
        const errors = this.validator.validate({pasteId});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const url = await this.urlRepository.findById({pasteId});

        if (!url) {
            this.presenter.presentFailure(new NotFound(`Hash with ID ${pasteId} was not found.`));
            return;
        }

        await this.urlRepository.deleteHash(pasteId);
        this.presenter.presentSuccess();
    }
}

module.exports = DeleteUrlInteractor;