/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({context: sequelize}) => {await sequelize.query(`CREATE TABLE IF NOT EXISTS url (
    paste_id varchar(60) PRIMARY KEY,
    url_id VARCHAR ( 60 ),
    FOREIGN KEY (paste_id) REFERENCES paste (id)
)`)};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({context: sequelize}) => {
    await sequelize.query(`DROP TABLE url CASCADE`);
};
