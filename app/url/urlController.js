const HttpPresenter = require('../httpPresenter');
const GetUrlValidator = require('./get-url/getUrlValidator');
const GetUrlInteractor = require('./get-url/getUrlInteractor');
const CreateUrlValidator = require('./create-url/createUrlValidator');
const CreateUrlInteractor = require('./create-url/createUrlInteractor');
const SearchUrlValidator = require('./search-url/searchUrlValidator');
const SearchUrlInteractor = require('./search-url/searchUrlInteractor');
const DeleteUrlValidator = require('./delete-url/deleteUrlValidator');
const DeleteUrlInteractor = require('./delete-url/deleteUrlInteractor');
const GetUrlHttpRequest = require('./get-url/getUrlHttpRequest');
const CreateUrlHttpRequest = require('./create-url/createUrlHttpRequest');
const SearchUrlHttpRequest = require('./search-url/searchUrlHttpRequest');
const DeleteUrlHttpRequest = require('./delete-url/deleteUrlHttpRequest');

class UrlRouterBuilder {
    constructor ({express, urlRepository, urlFactory, getUrlResponseBuilder, searchUrlResponseBuilder, pasteRepository, jwt, createUrlResponseBuilder, idGenerator}) {
        this.router = express.Router();
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.getUrlResponseBuilder = getUrlResponseBuilder;
        this.searchUrlResponseBuilder = searchUrlResponseBuilder;
        this.pasteRepository = pasteRepository;
        this.jwt = jwt;
        this.createUrlResponseBuilder = createUrlResponseBuilder;
        this.idGenerator = idGenerator;
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
                idGenerator: this.idGenerator
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