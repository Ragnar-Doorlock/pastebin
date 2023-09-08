const HttpPresenter = require('../httpPresenter');
const CreateUrlValidator = require('./create-url/createUrlValidator');
const CreateUrlInteractor = require('./create-url/createUrlInteractor');
const CreateUrlHttpRequest = require('./create-url/createUrlHttpRequest');
const ApiError = require('../errors/apiError');

class UrlRouterBuilder {
    constructor({
        express,
        urlRepository,
        urlFactory,
        pasteRepository,
        authTokenService,
        createUrlResponseBuilder,
        idGenerator,
        loggerProvider,
        pasteFactory
    }) {
        this.router = express.Router();
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.pasteRepository = pasteRepository;
        this.authTokenService = authTokenService;
        this.createUrlResponseBuilder = createUrlResponseBuilder;
        this.idGenerator = idGenerator;
        this.loggerProvider = loggerProvider;
        this.pasteFactory = pasteFactory;
    }

    createRoutes() {
        this.router.post('/', async (request, response) => {
            const validator = new CreateUrlValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new CreateUrlInteractor({
                presenter,
                validator,
                urlFactory: this.urlFactory,
                urlRepository: this.urlRepository,
                pasteRepository: this.pasteRepository,
                authTokenService: this.authTokenService,
                responseBuilder: this.createUrlResponseBuilder,
                idGenerator: this.idGenerator,
                loggerProvider: this.loggerProvider,
                pasteFactory: this.pasteFactory
            });

            try {
                await interactor.execute(new CreateUrlHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(new ApiError(error));
            }
        });

        return this.router;
    }
}

module.exports = UrlRouterBuilder;
