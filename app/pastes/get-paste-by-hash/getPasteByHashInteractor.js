const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const ApiError = require('../../errors/apiError');

class GetPasteByHashInteractor {
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
        
        const decodedToken = this.jwt.verify(request.hash, process.env.SECRET_KEY);

        if (!decodedToken) {
            this.presenter.presentFailure(new ApiError('Unable to verify url.'));
            return;
        } else {
            if ((Date.now() / 1000) > decodedToken.exp) {
                this.presenter.presentFailure(new ApiError('Url is expired.'));
                return;
            }
        }

        const paste = await this.pasteRepository.findById({id: decodedToken.id});

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetPasteByHashInteractor;