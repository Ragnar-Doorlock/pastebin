/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({context: sequelize}) => {await sequelize.query(`ALTER TABLE url DROP COLUMN hash;
ALTER TABLE url ADD url_id varchar(60);`)};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({context: sequelize}) => {
    await sequelize.query(`ALTER TABLE url DROP COLUMN url_id;
    ALTER TABLE url ADD COLUMN hash varchar(50);`);
};