const HttpPresenter = require('../httpPresenter');
const GetPasteInteractor = require('./get-paste/getPasteInteractor');
const GetPasteValidator = require('./get-paste/getPasteValidator');
const CreatePasteInteractor = require('./create-paste/createPasteInteractor');
const CreatePasteValidator = require('./create-paste/createPasteValidator');
const SearchPasteValidator = require('./search-paste/searchPasteValidator');
const SearchPasteInteractor = require('./search-paste/searchPasteInteractor');
const UpdatePasteInteractor = require('./update-paste/updatePasteInteractor');
const UpdatePasteValidator = require('./update-paste/updatePasteValidator');
const DeletePasteValidator = require('./delete-paste/deletePasteValidator');
const DeletePasteInteractor = require('./delete-paste/deletePasteInteractor');
const GetPasteHttpRequest = require('./get-paste/getPasteHttpRequest');
const CreatePasteHttpRequest = require('./create-paste/createPasteHttpRequest');
const SearchPasteHttpRequest = require('./search-paste/searchPasteHttpRequest');
const UpdatePasteHttpRequest = require('./update-paste/updatePasteHttpRequest');
const DeletePasteHttpRequest = require('./delete-paste/deletePasteHttpRequest');
const GetPasteByHashHttpRequest = require('./get-paste-by-hash/getPasteByHashHttpRequest');
const GetPasteByHashValidator = require('./get-paste-by-hash/getPasteByHashValidator');
const GetPasteByHashInteractor = require('./get-paste-by-hash/getPasteByHashInteractor');

class PasteRouterBuilder {
    constructor ({express, pasteRepository, pasteFactory, idGenerator, getPasteResponseBuilder, searchPasteResponseBuilder, getPasteByHashResponseBuilder, urlRepository, jwt}) {
        this.router = express.Router();
        this.pasteRepository = pasteRepository;
        this.pasteFactory = pasteFactory;
        this.idGenerator = idGenerator;
        this.getPasteResponseBuilder = getPasteResponseBuilder;
        this.searchPasteResponseBuilder = searchPasteResponseBuilder;
        this.getPasteByHashResponseBuilder = getPasteByHashResponseBuilder;
        this.urlRepository = urlRepository;
        this.jwt = jwt;
    }

    createRoutes() {
        this.router.get('/shared', async (request, response) => {
            const validator = new GetPasteByHashValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new GetPasteByHashInteractor({validator, presenter, pasteRepository: this.pasteRepository, urlRepository: this.urlRepository, 
                responseBuilder: this.getPasteByHashResponseBuilder, pasteFactory: this.pasteFactory, jwt: this.jwt});

            try {
                await interactor.execute(new GetPasteByHashHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });
        
        this.router.get('/:pasteId', async (request, response) => {
            const validator = new GetPasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new GetPasteInteractor({presenter, validator, pasteRepository: this.pasteRepository, 
                responseBuilder: this.getPasteResponseBuilder});

            try {
                await interactor.execute(new GetPasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/', async (request, response) => {
            const validator = new CreatePasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new CreatePasteInteractor({presenter, validator, pasteFactory: this.pasteFactory, 
                pasteRepository: this.pasteRepository, idGenerator: this.idGenerator});

            try {
                await interactor.execute(new CreatePasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/search-pastes', async (request, response) => {
            const validator = new SearchPasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new SearchPasteInteractor({validator, presenter, pasteRepository: this.pasteRepository, 
                responseBuilder: this.searchPasteResponseBuilder});

            try {
                //where/when can i restrict results, for example to show only public pastes?
                await interactor.execute(new SearchPasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.put('/:pasteId', async (request, response) => {
            const validator = new UpdatePasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new UpdatePasteInteractor({validator, presenter, pasteFactory: this.pasteFactory, 
                pasteRepository: this.pasteRepository});
           
            try {
                await interactor.execute(new UpdatePasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.delete('/:pasteId', async (request, response) => {
            const validator = new DeletePasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new DeletePasteInteractor({validator, presenter, pasteRepository: this.pasteRepository});

            try {
                await interactor.execute(new DeletePasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        return this.router;
    }
}

module.exports = PasteRouterBuilder;