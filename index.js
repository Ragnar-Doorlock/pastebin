require('dotenv').config();
const express = require('express');
const app = express();
const UserRouterBuilder = require('./app/users/userController');
const PasteRouterBuilder = require('./app/pastes/pasteController');
const UrlRouterBuilder = require('./app/url/urlController');
const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();
const { v4: uuidv4 } = require('uuid');
const IdGenerator = require('./app/idGenerator');
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
const GetUrlResponseBuilder = require('./app/url/get-url/getUrlResponseBuilder');
const SearchUrlResponseBuilder = require('./app/url/search-url/searchUrlResponseBuilder');
const CreateUrlResponseBuilder = require('./app/url/create-url/createUrlResponseBuilder');
const GetPasteByHashResponseBuilder = require('./app/pastes/get-shared-paste/getSharedPasteResponseBuilder');

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
const getUrlResponseBuilder = new GetUrlResponseBuilder();
const searchUrlResponseBuilder = new SearchUrlResponseBuilder();
const createUrlResponseBuilder = new CreateUrlResponseBuilder();
const getPasteByHashResponseBuilder = new GetPasteByHashResponseBuilder();
const loggerProvider = new LoggerProvider(log4js);
const logger = loggerProvider.create('index');

(async () => {
    const userRoutes = new UserRouterBuilder({
        express,
        userRepository,
        userFactory,
        idGenerator,
        getUserResponseBuilder,
        searchUserResponseBuilder
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
        jwt
    });
    const urlRoutes = new UrlRouterBuilder({
        express,
        urlRepository,
        urlFactory,
        getUrlResponseBuilder,
        searchUrlResponseBuilder,
        pasteRepository,
        jwt,
        createUrlResponseBuilder,
        idGenerator
    });

    app.use(express.json());
    app.use('/user', userRoutes.createRoutes());
    app.use('/paste', pasteRoutes.createRoutes());
    app.use('/url', urlRoutes.createRoutes());

    app.listen(3000, logger.info('App is running.'));

    //console.log(await pasteRepository.findAll({ids: ['paste-1']}));
    //console.log(await userRepository.findAll({ids: ['user-3']}));
    //console.log(await urlRepository.findOne({pasteId: 'paste-56d7d275-d21b-471a-8343-5c001c6fe0a2'}));
})();
