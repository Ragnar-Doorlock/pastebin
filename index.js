const express = require('express');
const app = express();

const Singleton = require('./db/singleton');
const pool = Singleton.getInstance();

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

})()