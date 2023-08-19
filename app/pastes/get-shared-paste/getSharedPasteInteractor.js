const ValidationError = require('../../errors/validationError');
const ApiError = require('../../errors/apiError');

class GetSharedPasteInteractor {
    constructor ({presenter, validator, pasteRepository, urlRepository, responseBuilder, pasteFactory, jwt}) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
        this.pasteFactory = pasteFactory;
        this.jwt = jwt;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        let decodedToken;
        try {
            decodedToken = await this.jwt.verify(request.hash, process.env.SECRET_KEY);
        } catch (error) {
            this.presenter.presentFailure(new ApiError(error));
            return;
        }

        if (!decodedToken.pasteId) {
            this.presenter.presentFailure(new ApiError('Invalid token.'));
            return;
        }

        const paste = await this.pasteRepository.findById({id: decodedToken.pasteId});

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetSharedPasteInteractor;