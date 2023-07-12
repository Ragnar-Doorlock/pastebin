const express = require('express');
const app = express();

const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/entity-repositories/userRepository');
const PasteRepository = require('./app/entity-repositories/pasteRepository');
const UrlRepository = require('./app/entity-repositories/urlRepository');

const dbProvider = new DBProvider({ pool });
const userRepository = new UserRepository({ dbProvider });
const pasteRepository = new PasteRepository({ dbProvider });
const urlRepository = new UrlRepository({ dbProvider });

(async () => {

    // if i use "jopa's" apostrofe counts as quotation mark (have to fix it somehow later)
    // in paste table, but most likely it's everywhere

    //console.log(await pasteRepository.findAll({ids: [1, 2]}));
    //console.log(await userRepository.findAll({ids: [1, 3]}));
    //console.log(await urlRepository.getUrl({ pasteID: 1}));
})()