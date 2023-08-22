const { Sequelize } = require('sequelize');
const { Umzug, JSONStorage } = require('umzug');
require('dotenv').config({ path: '../../.env' });

const getRawSqlClient = () => {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_DB_HOST,
        port: process.env.POSTGRES_DB_PORT,
        password: process.env.POSTGRES_DB_PASSWORD,
        database: process.env.POSTGRES_DB_DATABASE,
        username: process.env.POSTGRES_DB_USERNAME
    });

    return {
        query: async (sql, values) => sequelize.query(sql, { bind: values }),
    };
};

const migrator = new Umzug({
    migrations: {
        glob: 'migrations/*.js',
    },
    context: getRawSqlClient(),
    storage: new JSONStorage(),
    logger: console,
    create: {
        folder: 'migrations',
    },
});

module.exports = migrator;
