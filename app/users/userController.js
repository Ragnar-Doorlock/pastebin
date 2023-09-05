const HttpPresenter = require('../httpPresenter');
const GetUserInteractor = require('./get-user/getUserInteractor');
const GetUserValidator = require('./get-user/getUserValidator');
const SearchUserInteractor = require('./search-users/searchUserInteractor');
const SearchUserValidator = require('./search-users/searchUserValidator');
const UpdateUserInteractor = require('./update-user/updateUserInteractor');
const UpdateUserValidator = require('./update-user/updateUserValidator');
const DeleteUserInteractor = require('./delete-user/deleteUserInteractor');
const DeleteUserValidator = require('./delete-user/deleteUserValidator');
const GetUserHttpRequest = require('./get-user/getUserHttpRequest');
const SearchUserHttpRequest = require('./search-users/searchUserHttpRequest');
const UpdateUserHttpRequest = require('./update-user/updateUserHttpRequest');
const DeleteUserHttpRequest = require('./delete-user/deleteUserHttpRequest');
const auth = require('../authProvider');

class UserRouterBuilder {
    constructor({
        express,
        userRepository,
        userFactory,
        idGenerator,
        getUserResponseBuilder,
        searchUserResponseBuilder,
        loggerProvider,
        bcrypt
    }) {
        this.router = express.Router();
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.idGenerator = idGenerator;
        this.getUserResponseBuilder = getUserResponseBuilder;
        this.searchUserResponseBuilder = searchUserResponseBuilder;
        this.loggerProvider = loggerProvider;
        this.bcrypt = bcrypt;
    }

    createRoutes() {
        this.router.get('/:userId', auth, async (request, respone) => {
            const validator = new GetUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new GetUserInteractor({
                presenter,
                validator,
                userRepository: this.userRepository,
                responseBuilder: this.getUserResponseBuilder,
                loggerProvider: this.loggerProvider
            });

            try {
                await interactor.execute(new GetUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.post('/search-users', async (request, respone) => {
            const validator = new SearchUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new SearchUserInteractor({
                validator,
                userRepository: this.userRepository,
                presenter, responseBuilder: this.searchUserResponseBuilder
            });

            try {
                await interactor.execute(new SearchUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.put('/:userId', auth, async (request, respone) => {
            const validator = new UpdateUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new UpdateUserInteractor({
                validator,
                presenter,
                userFactory: this.userFactory,
                userRepository: this.userRepository,
                loggerProvider: this.loggerProvider,
                bcrypt: this.bcrypt
            });

            try {
                await interactor.execute(new UpdateUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        this.router.delete('/:userId', auth, async (request, respone) => {
            const validator = new DeleteUserValidator();
            const presenter = new HttpPresenter(request, respone);
            const interactor = new DeleteUserInteractor({
                validator,
                presenter,
                userRepository: this.userRepository,
                loggerProvider: this.loggerProvider
            });

            try {
                await interactor.execute(new DeleteUserHttpRequest(request));
            } catch (error) {
                presenter.presentFailure(error);
            }
        });

        return this.router;
    }
}

module.exports = UserRouterBuilder;
