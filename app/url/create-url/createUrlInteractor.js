const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const visibility = require('../../entities/paste-entity/visibility');

class CreateUrlInteractor {
    constructor({
        presenter,
        validator,
        urlRepository,
        urlFactory,
        authTokenService,
        pasteRepository,
        responseBuilder,
        idGenerator,
        loggerProvider,
        pasteFactory
    }) {
        this.presenter = presenter;
        this.validator = validator;
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.pasteRepository = pasteRepository;
        this.authTokenService = authTokenService;
        this.responseBuilder = responseBuilder;
        this.idGenerator = idGenerator;
        this.logger = loggerProvider.create(CreateUrlInteractor.name);
        this.pasteFactory = pasteFactory;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = await this.pasteRepository.findById({ id: request.pasteId });

        if (!paste) {
            this.presenter.presentFailure(new NotFound(`Paste with id ${request.pasteId} doesn't exist`));
            this.logger.error(`Not found: Paste with ID ${request.pasteId} was not found.`);
            return;
        }

        const hash = await this.authTokenService.sign({ pasteId: request.pasteId, visibility: paste.getVisibility() });

        if (paste.isPrivate()) {
            paste.changeVisibility(visibility.SHARED);
            await this.pasteRepository.save(paste);
        }

        const url = this.urlFactory.create({
            pasteId: request.pasteId,
            id: this.idGenerator.generate('url')
        });
        await this.urlRepository.save(url);

        this.presenter.presentSuccess(this.responseBuilder.build(hash.accessToken));
    }
}

module.exports = CreateUrlInteractor;
