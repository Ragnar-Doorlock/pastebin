/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: sequelize }) => {
    await sequelize.query(
        `CREATE TABLE IF NOT EXISTS users (
    id varchar(60) PRIMARY KEY,
    name VARCHAR ( 50 )
)`);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: sequelize }) => {
    await sequelize.query('DROP TABLE users CASCADE');
};
