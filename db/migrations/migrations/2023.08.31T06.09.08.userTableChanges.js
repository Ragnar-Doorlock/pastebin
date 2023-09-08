/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE users ADD login varchar(60) UNIQUE, ADD password varchar(60);');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: sequelize }) => {
    await sequelize.query(`ALTER TABLE users DROP COLUMN login;
    ALTER TABLE users DROP COLUMN password;`);
};
