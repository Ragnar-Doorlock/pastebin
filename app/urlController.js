const HttpPresenter = require('./httpPresenter');
const GetUrlValidator = require('./url/get-url/getUrlValidator');
const GetUrlInteractor = require('./url/get-url/getUrlInteractor');
const CreateUrlValidator = require('./url/create-url/createUrlValidator');
const CreateUrlInteractor = require('./url/create-url/createUrlInteractor');
const SearchUrlValidator = require('./url/search-url/searchUrlValidator');
const SearchUrlInteractor = require('./url/search-url/searchUrlInteractor');
const DeleteUrlValidator = require('./url/delete-url/deleteUrlValidator');
const DeleteUrlInteractor = require('./url/delete-url/deleteUrlInteractor');
const GetUrlHttpRequest = require('./url/get-url/getUrlHttpRequest');
const CreateUrlHttpRequest = require('./url/create-url/createUrlHttpRequest');
const SearchUrlHttpRequest = require('./url/search-url/searchUrlHttpRequest');
const DeleteUrlHttpRequest = require('./url/delete-url/deleteUrlHttpRequest');

class UrlRouterBuilder {
    constructor ({express, urlRepository, urlFactory, getUrlResponseBuilder, searchUrlResponseBuilder}) {
        this.router = express.Router();
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.getUrlResponseBuilder = getUrlResponseBuilder;
        this.searchUrlResponseBuilder = searchUrlResponseBuilder;
    }

    createRoutes() {
        this.router.get('/:pasteId', async (request, response) => {
            const validator = new GetUrlValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new GetUrlInteractor({presenter, validator, responseBuilder: this.getUrlResponseBuilder, urlRepository: this.urlRepository});

            try {
                await interactor.execute(new GetUrlHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/', async (request, response) => {
            const validator = new CreateUrlValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new CreateUrlInteractor({presenter, validator, urlFactory: this.urlFactory, urlRepository: this.urlRepository});

            try {
                // i pass hash here but if we have hash generator later then i have to pass only pasteId
                await interactor.execute(new CreateUrlHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/search-url', async (request, response) => {
            const validator = new SearchUrlValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new SearchUrlInteractor({presenter, validator, urlRepository: this.urlRepository, responseBuilder: this.searchUrlResponseBuilder});

            try {
                await interactor.execute(new SearchUrlHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.delete('/:pasteId', async (request, response) => {
            const validator = new DeleteUrlValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new DeleteUrlInteractor({presenter, validator, urlRepository: this.urlRepository});

            try {
                await interactor.execute(new DeleteUrlHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        return this.router;
    }
}

module.exports = UrlRouterBuilder;