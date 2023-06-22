/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({context: sequelize}) => {await sequelize.query(`CREATE TABLE IF NOT EXISTS url (
    paste_id INT PRIMARY KEY,
    hash VARCHAR ( 50 ),
    FOREIGN KEY (paste_id) REFERENCES paste (id)
)`)};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({context: sequelize}) => {await sequelize.query(`DROP TABLE url`)};
