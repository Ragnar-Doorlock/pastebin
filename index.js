require('dotenv').config();
const express = require('express');
const app = express();
const UserRouterBuilder = require('./app/users/userController');
const PasteRouterBuilder = require('./app/pastes/pasteController');
const UrlRouterBuilder = require('./app/url/urlController');
const AuthRouterBuilder = require('./app/authorisation/authController');
const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();
const { v4: uuidv4 } = require('uuid');
const IdGenerator = require('./app/idGenerator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
});

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/users/userRepository');
const PasteRepository = require('./app/pastes/pasteRepository');
const UrlRepository = require('./app/url/urlRepository');
const UserFactory = require('./app/entities/user-entity/userFactory');
const PasteFactory = require('./app/entities/paste-entity/pasteFactory');
const UrlFactory = require('./app/entities/url-entity/urlFactory');
const LoggerProvider = require('./app/loggerProvider');

const GetUserResponseBuilder = require('./app/users/get-user/getUserResponseBuilder');
const SearchUserResponseBuilder = require('./app/users/search-users/searchUserResponseBuilder');
const GetPasteResponseBuilder = require('./app/pastes/get-paste/getPasteResponseBuilder');
const SearchPasteResponseBuilder = require('./app/pastes/search-paste/searchPasteResponseBuilder');
const CreateUrlResponseBuilder = require('./app/url/create-url/createUrlResponseBuilder');
const GetPasteByHashResponseBuilder = require('./app/pastes/get-shared-paste/getSharedPasteResponseBuilder');
const LoginResponseBuilder = require('./app/authorisation/login/loginResponseBuilder');

const userFactory = new UserFactory();
const pasteFactory = new PasteFactory();
const urlFactory = new UrlFactory();
const dbProvider = new DBProvider({ pool });
const userRepository = new UserRepository({ dbProvider, userFactory });
const pasteRepository = new PasteRepository({ dbProvider, pasteFactory });
const urlRepository = new UrlRepository({ dbProvider, urlFactory });
const idGenerator = new IdGenerator({ uuid: uuidv4 });
const getUserResponseBuilder = new GetUserResponseBuilder();
const searchUserResponseBuilder = new SearchUserResponseBuilder();
const getPasteResponseBuilder = new GetPasteResponseBuilder();
const searchPasteResponseBuilder = new SearchPasteResponseBuilder();
const createUrlResponseBuilder = new CreateUrlResponseBuilder();
const getPasteByHashResponseBuilder = new GetPasteByHashResponseBuilder();
const loginResponseBuilder = new LoginResponseBuilder();

(async () => {
    const loggerProvider = new LoggerProvider(log4js);
    const logger = loggerProvider.create('Logger');

    const userRoutes = new UserRouterBuilder({
        express,
        userRepository,
        userFactory,
        idGenerator,
        getUserResponseBuilder,
        searchUserResponseBuilder,
        loggerProvider,
        bcrypt
    });
    const pasteRoutes = new PasteRouterBuilder({
        express,
        pasteRepository,
        pasteFactory,
        idGenerator,
        getPasteResponseBuilder,
        searchPasteResponseBuilder,
        urlRepository,
        getPasteByHashResponseBuilder,
        jwt,
        loggerProvider
    });
    const urlRoutes = new UrlRouterBuilder({
        express,
        urlRepository,
        urlFactory,
        pasteRepository,
        jwt,
        createUrlResponseBuilder,
        idGenerator,
        loggerProvider
    });

    const authRoutes = new AuthRouterBuilder({
        express,
        jwt,
        userFactory,
        userRepository,
        loggerProvider,
        loginResponseBuilder,
        bcrypt,
        idGenerator
    });

    app.use(express.json());
    app.use('/user', userRoutes.createRoutes());
    app.use('/paste', pasteRoutes.createRoutes());
    app.use('/url', urlRoutes.createRoutes());
    app.use('/auth', authRoutes.createRoutes());

    app.listen(3000, logger.info('App is running.'));

    //console.log(await pasteRepository.findAll({ids: ['paste-1']}));
    //console.log(await userRepository.findOne({id: 'user-bd68c580-bcd6-4b67-8131-288f2bb6a155', login: 'Ledenec'}));
    //console.log(await urlRepository.findOne({pasteId: 'paste-56d7d275-d21b-471a-8343-5c001c6fe0a2'}));
})();
