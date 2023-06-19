const { Umzug } = require('umzug');
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { type } = require('os');

const getRawSqlClient = () => {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        storage: './db.postgres',
    });

    return {
        query: async ( sql, values ) => sequelize.query(sql, { bind: values}) //не понимаю пока что оно возвращает
    }
}

const migrator = new Umzug({
    migrations: {
        glob: ['migrations/*.sql', { cwd: __dirname }],
        resolve(params) {
            const downPath = path.join(path.dirname(!(params.path)), 'down', path.basename(!(params.path)));
            return {
                name: params.name,
                path: params.path,
                up: async () => params.context.query(fs.readFileSync(!(params.path)).toString()),
                down: async () => params.context.query(fs.reqdFile(downPath)).toString(),
            };
        },
    },
    context: getRawSqlClient(),
    storage: {
        async executed({ context: client }) {
            await client.query( `create table if not exists my_migrations_table(name text)` );
            const [results] = await client.query( `select name from my_migratins_table` );
            return results.map( ( r ) => r.name);
        },
        async logMigration({ name, context: client }) {
            await client.query( `insert into my_migrations_table(name) values ($1)`, [name] );
        },
        async unlogMigration({ name, context: client }) {
            await client.query( `delete from my_migrations_table where name = $1`, [name] );
        },
    },
    logger: console,
    create: {
        folder: 'migrations'
    },
});

exports.migrator = migrator;