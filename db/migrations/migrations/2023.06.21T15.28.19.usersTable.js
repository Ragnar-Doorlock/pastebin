/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({context: sequelize}) => { await sequelize.query(
    `CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR ( 50 )
)`)};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({context: sequelize}) => {
    await sequelize.query(`DROP TABLE users`)
};