/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({context: sequelize}) => { await sequelize.query(`CREATE TABLE paste (
    id serial PRIMARY KEY,
    name VARCHAR ( 50 ),
    text VARCHAR ( 2000 ),
    expires_after TIMESTAMP,
    visibility VARCHAR ( 10 ),
    author_id INT NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp,
    FOREIGN KEY (author_id) REFERENCES users (id)
)`)};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({context: sequelize}) => { await sequelize.query(`DROP TABLE paste`)};
