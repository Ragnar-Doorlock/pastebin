/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE paste DROP COLUMN text;');
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: sequelize }) => {
    await sequelize.query('ALTER TABLE paste ADD text varchar(2000);');
};
