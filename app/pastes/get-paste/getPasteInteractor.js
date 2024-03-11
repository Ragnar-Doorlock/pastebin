const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const ForbiddenError = require('../../errors/forbidden');

class GetPasteInteractor {
    constructor({
        presenter,
        validator,
        pasteRepository,
        responseBuilder,
        loggerProvider,
        pasteFactory,
        pasteStatisticsService,
        pasteTextStorage
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.responseBuilder = responseBuilder;
        this.logger = loggerProvider.create(GetPasteInteractor.name);
        this.pasteFactory = pasteFactory;
        this.pasteStatisticsService = pasteStatisticsService;
        this.textStorage = pasteTextStorage;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure( new ValidationError(errors) );
            return;
        }

        const paste = await this.pasteRepository.findById({ id: request.id });

        if (!paste) {
            this.presenter.presentFailure( new NotFound(`Paste with ${request.id} was not found.`));
            this.logger.error(`Not found: Paste with ID ${request.id} was not found.`);
            return;
        }

        if (paste.isPublic()) {
            paste.increaseTotalViewsCount();
            await this.pasteStatisticsService.increaseViews(paste.getId());
            const text = await this.textStorage.getText(paste.getId());
            this.presenter.presentSuccess(this.responseBuilder.build({ entity: paste, text }));
            return;
        }

        if (request.userId !== paste.getAuthorId()) {
            this.presenter.presentFailure( new ForbiddenError('You don\'t have access to this paste.'));
            return;
        }

        paste.increaseTotalViewsCount();
        await this.pasteStatisticsService.increaseViews(paste.getId());

        const text = await this.textStorage.getText(paste.getId());
        this.presenter.presentSuccess(this.responseBuilder.build({ entity: paste, text }));
    }
}

module.exports = GetPasteInteractor;
