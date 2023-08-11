const ValidationError = require('../../errors/validationError');

class SearchPasteInteractor {
    constructor ({validator, presenter, pasteRepository, responseBuilder}) {
        this.validator = validator;
        this.presenter = presenter;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if(errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const pasteId = Array.isArray(request.id) ? request.id : [request.id];
        const pastes = await this.pasteRepository.findAll({ids: pasteId, name: request.name, authorId: request.authorId});

        this.presenter.presentSuccess(this.responseBuilder.build(pastes));
    }
}

module.exports = SearchPasteInteractor;