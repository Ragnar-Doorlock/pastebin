const ValidationError = require('../../errors/validationError');
const NotFound = require('../../errors/notFound');

class SearchPasteInteractor {
    constructor ({validator, presenter, pasteRepository, responseBuilder}) {
        this.validator = validator;
        this.presenter = presenter;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
    }

    async execute({id, name, authorId}) {
        const errors = this.validator.validate({id, name, authorId});

        if(errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const pasteId = Array.isArray(id) ? id : [id];
        const pastes = await this.pasteRepository.findAll({ids: pasteId, name, authorId});

        this.presenter.presentSuccess(this.responseBuilder.build(pastes));
    }
}

module.exports = SearchPasteInteractor;