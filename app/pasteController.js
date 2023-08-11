const HttpPresenter = require('./httpPresenter');
const GetPasteInteractor = require('./pastes/get-paste/getPasteInteractor');
const GetPasteValidator = require('./pastes/get-paste/getPasteValidator');
const CreatePasteInteractor = require('./pastes/create-paste/createPasteInteractor');
const CreatePasteValidator = require('./pastes/create-paste/createPasteValidator');
const SearchPasteValidator = require('./pastes/search-paste/searchPasteValidator');
const SearchPasteInteractor = require('./pastes/search-paste/searchPasteInteractor');
const UpdatePasteInteractor = require('./pastes/update-paste/updatePasteInteractor');
const UpdatePasteValidator = require('./pastes/update-paste/updatePasteValidator');
const DeletePasteValidator = require('./pastes/delete-paste/deletePasteValidator');
const DeletePasteInteractor = require('./pastes/delete-paste/deletePasteInteractor');
const GetPasteHttpRequest = require('./pastes/get-paste/getPasteHttpRequest');
const CreatePasteHttpRequest = require('./pastes/create-paste/createPasteHttpRequest');
const SearchPasteHttpRequest = require('./pastes/search-paste/searchPasteHttpRequest');
const UpdatePasteHttpRequest = require('./pastes/update-paste/updatePasteHttpRequest');
const DeletePasteHttpRequest = require('./pastes/delete-paste/deletePasteHttpRequest');

class PasteRouterBuilder {
    constructor ({express, pasteRepository, pasteFactory, idGenerator, getPasteResponseBuilder, searchPasteResponseBuilder}) {
        this.router = express.Router();
        this.pasteRepository = pasteRepository;
        this.pasteFactory = pasteFactory;
        this.idGenerator = idGenerator;
        this.getPasteResponseBuilder = getPasteResponseBuilder;
        this.searchPasteResponseBuilder = searchPasteResponseBuilder;
    }

    createRoutes() {
        this.router.get('/:pasteId', async (request, response) => {
            const validator = new GetPasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new GetPasteInteractor({presenter, validator, pasteRepository: this.pasteRepository, responseBuilder: this.getPasteResponseBuilder});

            try {
                await interactor.execute(new GetPasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/', async (request, response) => {
            const validator = new CreatePasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new CreatePasteInteractor({presenter, validator, pasteFactory: this.pasteFactory, pasteRepository: this.pasteRepository, idGenerator: this.idGenerator});

            try {
                await interactor.execute(new CreatePasteHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/search-pastes', async (request, response) => {
            const validator = new SearchPasteValidator();
            const presenter = new HttpPresenter(request, response);
            const interactor = new SearchPasteInteractor({validator, presenter, pasteRepository: this.pasteRepository, responseBuilder: this.searchPasteResponseBuilder});

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
            const interactor = new UpdatePasteInteractor({validator, presenter, pasteFactory: this.pasteFactory, pasteRepository: this.pasteRepository});
           
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