const {Sequelize} = require('sequelize');
const { Umzug, JSONStorage } = require('umzug');

const getRawSqlClient = () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
        port: 5432,
        password: '11234',
        database: 'pastebin',
        username: 'postgres',
  });

  return {
    query: async (sql, values) => sequelize.query(sql, { bind: values }),
  };
};

const migrator = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
  },
  context: getRawSqlClient(),
  storage: new JSONStorage(),
  logger: console,
  create: {
    folder: 'migrations',
  },
});

module.exports = migrator;