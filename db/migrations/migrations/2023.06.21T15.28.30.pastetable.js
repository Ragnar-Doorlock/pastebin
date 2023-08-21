/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({context: sequelize}) => { await sequelize.query(`
CREATE TYPE visibility_values AS ENUM ('public', 'private', 'shared');

CREATE TABLE IF NOT EXISTS paste (
    id varchar(60) PRIMARY KEY,
    name VARCHAR ( 50 ),
    text VARCHAR ( 2000 ),
    expires_after TIMESTAMP,
    visibility visibility_values,
    author_id varchar(40) NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp,
    FOREIGN KEY (author_id) REFERENCES users (id)
);`)};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({context: sequelize}) => { 
    await sequelize.query(`DROP TABLE paste CASCADE
    DROP TYPE IF EXISTS visibility_values CASCADE`);
};
