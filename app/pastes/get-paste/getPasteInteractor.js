const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class GetPasteInteractor {
    constructor ({presenter, validator, pasteRepository, responseBuilder}) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute({id}) {
        const errors = this.validator.validate({id});

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const paste = await this.pasteRepository.findById({id});

        if (!paste) {
            this.presenter.presentFailure( new NotFound(`Paste with ${id} was not found.`));
            return;
        }

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetPasteInteractor;