/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE paste ADD total_views INT DEFAULT 0;');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE paste DROP COLUMN total_views;');
};
