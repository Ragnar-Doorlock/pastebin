const ValidationError = require('../../errors/validationError');
const ApiError = require('../../errors/apiError');

class GetSharedPasteInteractor {
    constructor({
        presenter,
        validator,
        pasteRepository,
        urlRepository,
        responseBuilder,
        pasteFactory,
        authTokenService,
        loggerProvider,
        pasteStatisticsService
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.urlRepository = urlRepository;
        this.responseBuilder = responseBuilder;
        this.pasteFactory = pasteFactory;
        this.authTokenService = authTokenService;
        this.logger = loggerProvider.create(GetSharedPasteInteractor.name);
        this.pasteStatisticsService = pasteStatisticsService;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        let decodedToken;
        try {
            decodedToken = await this.authTokenService.verify(request.hash);
        } catch (error) {
            this.presenter.presentFailure(new ApiError(error));
            this.logger.error(error);
            return;
        }

        if (!decodedToken.pasteId) {
            this.presenter.presentFailure(new ApiError('Invalid token.'));
            this.logger.error('Invalid token.');
            return;
        }

        const paste = await this.pasteRepository.findById({ id: decodedToken.pasteId });

        paste.increaseTotalViewsCount();
        await this.pasteStatisticsService.increaseViews(paste.getId());

        this.presenter.presentSuccess(this.responseBuilder.build(paste));
    }
}

module.exports = GetSharedPasteInteractor;
