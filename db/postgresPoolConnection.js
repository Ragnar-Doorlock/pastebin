const { Pool } = require("pg");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

class PostgresPoolConnection {
    constructor() {
        this.pool = new Pool({
            user: process.env.POSTGRES_DB_USERNAME,
            host: process.env.POSTGRES_DB_HOST,
            database: process.env.POSTGRES_DB_DATABASE,
            password: process.env.POSTGRES_DB_PASSWORD,
            port: process.env.POSTGRES_DB_PORT,
        });
    }

    getInstance() {
        if (this.pool) {
            return this.pool;
        }

        this.pool = new Singleton();
        return this.pool;
    }
}

module.exports = new PostgresPoolConnection();