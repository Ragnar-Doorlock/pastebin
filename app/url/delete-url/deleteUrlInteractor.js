const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class DeleteUrlInteractor {
    constructor ({validator, presenter, urlRepository}) {
        this.presenter = presenter;
        this.validator = validator;
        this.urlRepository = urlRepository;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const url = await this.urlRepository.findById({pasteId: request.pasteId});

        if (!url) {
            this.presenter.presentFailure(new NotFound(`Hash with ID ${request.pasteId} was not found.`));
            return;
        }

        await this.urlRepository.deleteHash(request.pasteId);
        this.presenter.presentSuccess();
    }
}

module.exports = DeleteUrlInteractor;