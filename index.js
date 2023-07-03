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

const UserRepository = require('./app/entity-repositories/userRepository');
const userRepository = new UserRepository({pool});

const PasteReository = require('./app/entity-repositories/pasteRepository');
const pasteRepository = new PasteReository({pool});

(async () => {

    //console.log(await userRepository.findAll({id: 1}));
    console.log(await pasteRepository.findAll({name: 'new name'}));
    
})()