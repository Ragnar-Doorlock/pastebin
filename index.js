const express = require('express');
const app = express();
const { Pool } = require("pg");
const pg = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_DATABASE,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: process.env.POSTGRES_DB_PORT,
});

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/entity-repositories/userRepository');
const PasteReository = require('./app/entity-repositories/pasteRepository');
const UrlRepository = require('./app/entity-repositories/urlRepository');

const dbProvider = new DBProvider({ pool });
const userRepository = new UserRepository({ dbProvider });
const pasteRepository = new PasteReository({ dbProvider });
const urlRepository = new UrlRepository({ dbProvider });

(async () => {

    // if i use "jopa's" apostrofe counts as quotation mark (have to fix it somehow later)
    // in paste table, but most likely it's everywhere

    //const gamno = await userRepository.findAll({id: [1, 3, 4], name: 'jopa'});
    //const gamno = await pasteRepository.findAll({id: [1, 3, 4], name: 'jopas paste'});
    //console.log(gamno);

})()