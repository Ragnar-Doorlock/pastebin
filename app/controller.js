const { v4: uuidv4 } = require('uuid');
const HttpPresenter = require('./httpPresenter');
const GetUserInteractor = require('./users/get-user/getUserInteractor');
const GetUserValidator = require('./users/get-user/getUserValidator');
const CreateUserValidator = require('./users/create-user/createUserValidator');
const CreateUserInteractor = require('./users/create-user/createUserInteractor');
const SearchUserInteractor = require('./users/search-users/searchUserInteractor');
const SearchUserValidator = require('./users/search-users/searchUserValidator');
const UpdateUserInteractor = require('./users/update-user/updateUserInteractor');
const UpdateUserValidator = require('./users/update-user/updateUserValidator');
const DeleteUserInteractor = require('./users/delete-user/deleteUserInteractor');
const UserFactory = require('./entities/user-entity/userFactory');
const DeleteUserValidator = require('./users/delete-user/deleteUserValidator');

class RouterBuilder {
    constructor({express, userRepository}) {
        this.router = express.Router();
        this.userRepository = userRepository;
    }

    createRoutes() {
        this.router.get('/:userId', async (req, res) => {
            const validator = new GetUserValidator();
            const presenter = new HttpPresenter(req, res);
            const interactor = new GetUserInteractor({presenter, validator, userRepository: this.userRepository});

            try {
                await interactor.execute({id: req.params.userId});
            } catch(err) {
                presenter.presentFailure(err);
            }
        });

        this.router.post('/', async (req, res) => {
            const validator = new CreateUserValidator();
            const presenter = new HttpPresenter(req, res);
            const userFactory = new UserFactory();
            const interactor = new CreateUserInteractor({presenter, validator, userFactory, userRepository: this.userRepository, uuid: uuidv4});

            try {
                await interactor.execute(req.body.name);
            } catch (err) {
                presenter.presentFailure(err);
            }
        });

        this.router.post('/search-users', async (req, res) => {
            const validator = new SearchUserValidator();
            const presenter = new HttpPresenter(req, res);
            const interactor = new SearchUserInteractor({validator, userRepository: this.userRepository, presenter});
            
            try {
                await interactor.execute({id: req.body.id, name: req.body.name});
            } catch (err) {
                presenter.presentFailure(err);
            }
        });

        this.router.put('/:userId', async (req, res) => {
            const validator = new UpdateUserValidator();
            const presenter = new HttpPresenter(req, res);
            const userFactory = new UserFactory();
            const interactor = new UpdateUserInteractor({validator, presenter, userFactory, userRepository: this.userRepository});

            try {
                await interactor.execute({id: req.params.userId, name: req.body.name});
            } catch (err) {
                presenter.presentFailure(err);
            }
        });

        this.router.delete('/:userId', async (req, res) => {
            const validator = new DeleteUserValidator();
            const presenter = new HttpPresenter(req, res);
            const interactor = new DeleteUserInteractor({validator, presenter, userRepository: this.userRepository});

            try {
                await interactor.execute(req.params.userId);
            } catch (err) {
                presenter.presentFailure(err);
            }
        })
        
        return this.router;
    }
}

module.exports = RouterBuilder;