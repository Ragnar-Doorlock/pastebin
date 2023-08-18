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
        this.jwt.verify(request.hash, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                this.presenter.presentFailure(new ApiError(error));
                return;
            }
            decodedToken = decoded;
            //console.log(decoded);
        });

        if (!decodedToken.pasteId) {
            this.presenter.presentFailure(new ApiError('Unable to verify url.'));
            return;
        }

        const paste = await this.pasteRepository.findById({id: decodedToken.pasteId});

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetSharedPasteInteractor;