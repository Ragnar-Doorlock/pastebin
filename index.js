const express = require('express');
const app = express();
const RouterBuilder = require('./app/controller');
const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/entity-repositories/userRepository');
const PasteRepository = require('./app/entity-repositories/pasteRepository');
const UrlRepository = require('./app/entity-repositories/urlRepository');
const UserFactory = require('./app/entities/user-entity/userFactory');
const PasteFactory = require('./app/entities/paste-entity/pasteFactory');
const UrlFactory = require('./app/entities/url-entity/urlFactory');

const userFactory = new UserFactory();
const pasteFactory = new PasteFactory();
const urlFactory = new UrlFactory();
const dbProvider = new DBProvider({ pool });
const userRepository = new UserRepository({ dbProvider, userFactory });
const pasteRepository = new PasteRepository({ dbProvider, pasteFactory });
const urlRepository = new UrlRepository({ dbProvider, urlFactory });

(async () => {
    const routes = new RouterBuilder({express, userRepository});

    app.use(express.json());
    app.use('/user', routes.createRoutes());

    app.listen(3000, () => console.log(`App is running.`));

    //console.log(await pasteRepository.findAll({ids: ['paste-1']}));
    //console.log(await userRepository.findAll({ids: ['user-3']}));
    //console.log(await urlRepository.findAll({pasteIds: ['paste-1', 'paste-2']}));
})()