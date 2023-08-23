const HttpPresenter = require('../httpPresenter');
const CreateUrlValidator = require('./create-url/createUrlValidator');
const CreateUrlInteractor = require('./create-url/createUrlInteractor');
const CreateUrlHttpRequest = require('./create-url/createUrlHttpRequest');

class UrlRouterBuilder {
    constructor({
        express,
        urlRepository,
        urlFactory,
        pasteRepository,
        jwt,
        createUrlResponseBuilder,
        idGenerator,
        loggerProvider
    }) {
        this.router = express.Router();
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.pasteRepository = pasteRepository;
        this.jwt = jwt;
        this.createUrlResponseBuilder = createUrlResponseBuilder;
        this.idGenerator = idGenerator;
        this.loggerProvider = loggerProvider;
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
                jwt: this.jwt,
                responseBuilder: this.createUrlResponseBuilder,
                idGenerator: this.idGenerator,
                loggerProvider: this.loggerProvider
            });

            try {
                await interactor.execute(new CreateUrlHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        return this.router;
    }
}

module.exports = UrlRouterBuilder;
