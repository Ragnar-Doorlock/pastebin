const express = require('express');
const app = express();
const UserRouterBuilder = require('./app/userController');
const PasteRouterBuilder = require('./app/pasteController');
const UrlRouterBuilder = require('./app/urlController');
const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();
const { v4: uuidv4 } = require('uuid');
const IdGenerator = require('./app/idGenerator');

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/entity-repositories/userRepository');
const PasteRepository = require('./app/entity-repositories/pasteRepository');
const UrlRepository = require('./app/entity-repositories/urlRepository');
const UserFactory = require('./app/entities/user-entity/userFactory');
const PasteFactory = require('./app/entities/paste-entity/pasteFactory');
const UrlFactory = require('./app/entities/url-entity/urlFactory');

const GetUserResponseBuilder = require('./app/response-builders/getUserResponseBuilder');
const SearchUserResponseBuilder = require('./app/response-builders/searchUserResponseBuilder');
const GetPasteResponseBuilder = require('./app/response-builders/getPasteResponseBuilder');
const SearchPasteResponseBuilder = require('./app/response-builders/searchPasteResponseBuilder');
const GetUrlResponseBuilder = require('./app/response-builders/getUrlResponseBuilder');
const SearchUrlResponseBuilder = require('./app/response-builders/searchUrlResponseBuilder');

const userFactory = new UserFactory();
const pasteFactory = new PasteFactory();
const urlFactory = new UrlFactory();
const dbProvider = new DBProvider({ pool });
const userRepository = new UserRepository({ dbProvider, userFactory });
const pasteRepository = new PasteRepository({ dbProvider, pasteFactory });
const urlRepository = new UrlRepository({ dbProvider, urlFactory });
const idGenerator = new IdGenerator({uuid: uuidv4});
const getUserResponseBuilder = new GetUserResponseBuilder();
const searchUserResponseBuilder = new SearchUserResponseBuilder();
const getPasteResponseBuilder = new GetPasteResponseBuilder();
const searchPasteResponseBuilder = new SearchPasteResponseBuilder();
const getUrlResponseBuilder = new GetUrlResponseBuilder();
const searchUrlResponseBuilder = new SearchUrlResponseBuilder();

(async () => {
    const userRoutes = new UserRouterBuilder({express, userRepository, userFactory, idGenerator, getUserResponseBuilder, searchUserResponseBuilder});
    const pasteRoutes = new PasteRouterBuilder({express, pasteRepository, pasteFactory, idGenerator, getPasteResponseBuilder, searchPasteResponseBuilder});
    const urlRoutes = new UrlRouterBuilder({express, urlRepository, urlFactory, getUrlResponseBuilder, searchUrlResponseBuilder});

    app.use(express.json());
    app.use('/user', userRoutes.createRoutes());
    app.use('/paste', pasteRoutes.createRoutes());
    app.use('/url', urlRoutes.createRoutes());

    app.listen(3000, () => console.log(`App is running.`));

    //console.log(await pasteRepository.findAll({ids: ['paste-1']}));
    //console.log(await userRepository.findAll({ids: ['user-3']}));
    //console.log(await urlRepository.findAll({pasteIds: ['paste-1', 'paste-2']}));
})()