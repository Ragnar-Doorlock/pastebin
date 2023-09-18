/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE users ADD pastes_created_count INT DEFAULT 0;');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE users DROP COLUMN pastes_created_count;');
};
