const express = require('express');
const app = express();

const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();

//the list of requires is just for debug, remove all of it from index later
const { v4: uuidv4 } = require('uuid');

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/entity-repositories/userRepository');
const PasteRepository = require('./app/entity-repositories/pasteRepository');
const UrlRepository = require('./app/entity-repositories/urlRepository');
const UserFactory = require('./app/entities/user-entity/userFactory');
const PasteFactory = require('./app/entities/paste-entity/pasteFactory');
const UrlFactory = require('./app/entities/url-entity/urlFactory');

const dbProvider = new DBProvider({ pool });
const userRepository = new UserRepository({ dbProvider });
const pasteRepository = new PasteRepository({ dbProvider });
const urlRepository = new UrlRepository({ dbProvider });
const userFactory = new UserFactory();
const pasteFactory = new PasteFactory();
const urlFactory = new UrlFactory();

(async () => {

    // if i use "jopa's" apostrofe counts as quotation mark (have to fix it somehow later)
    // in paste table, but most likely it's everywhere

    //console.log(await pasteRepository.findAll({ids: ['paste-1']}));
    //console.log(await userRepository.findAll({ids: ['user-3']}));
    //console.log(await urlRepository.findAll({pasteIds: ['paste-1', 'paste-2']}));
    

    //const user = userFactory.create({id: `user-${uuidv4()}`, name: 'Joppap'});
    //await userRepository.save(user);

    //const paste = pasteFactory.create({id: `paste-${uuidv4()}`, name: 'Joppaps paste', text: 'new text', expiresAfter: '12.12.2023 12:00:00', visibility: 'public', authorId: 'user-3'});
    //await pasteRepository.save(paste);

    //const url = urlFactory.create({pasteId: `paste-1`, hash: 'fake-hash-2'});
    //console.log(url);
    //await urlRepository.createHash(url);
})()