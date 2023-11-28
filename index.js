require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const UserRouterBuilder = require('./app/users/userController');
const PasteRouterBuilder = require('./app/pastes/pasteController');
const UrlRouterBuilder = require('./app/url/urlController');
const PostgresPoolConnection = require('./db/postgresPoolConnection');
const pool = PostgresPoolConnection.getInstance();
const { v4: uuidv4 } = require('uuid');
const IdGenerator = require('./app/idGenerator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const AWS = require('@aws-sdk/client-s3');
log4js.configure({
    appenders: {
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
});
const redis = require('redis');
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});
const s3  = new AWS.S3({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_ACCESS_PASSWORD
    },
    endpoint: process.env.MINIO_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

const DBProvider = require('./db/dbProvider');
const UserRepository = require('./app/users/userRepository');
const PasteRepository = require('./app/pastes/pasteRepository');
const UrlRepository = require('./app/url/urlRepository');
const UserFactory = require('./app/entities/user-entity/userFactory');
const PasteFactory = require('./app/entities/paste-entity/pasteFactory');
const UrlFactory = require('./app/entities/url-entity/urlFactory');
const LoggerProvider = require('./app/loggerProvider');
const AuthTokenService = require('./app/authTokenService');
const PasswordHashService = require('./app/passwordHashService');
const RedisProvider = require('./app/redis-provider/redisProvider');
const CacheProvider = require('./app/cache-provider/cacheProvider');
const PasteStatisticsService = require('./app/pastes/pasteStatisticsService');
const S3Provider = require('./app/s3-provider/s3Provider');
const PasteTextStorage = require('./app/paste-text-storage/pasteTextStorage');

const GetUserResponseBuilder = require('./app/users/get-user/getUserResponseBuilder');
const SearchUserResponseBuilder = require('./app/users/search-users/searchUserResponseBuilder');
const GetPasteResponseBuilder = require('./app/pastes/get-paste/getPasteResponseBuilder');
const SearchPasteResponseBuilder = require('./app/pastes/search-paste/searchPasteResponseBuilder');
const CreateUrlResponseBuilder = require('./app/url/create-url/createUrlResponseBuilder');
const GetPasteByHashResponseBuilder = require('./app/pastes/get-shared-paste/getSharedPasteResponseBuilder');
const LoginResponseBuilder = require('./app/users/login/loginResponseBuilder');
const RegisterResponseBuilder = require('./app/users/register-user/registerUserResponseBuilder');

(async () => {
    const loggerProvider = new LoggerProvider(log4js);
    const s3Provider = new S3Provider(s3, loggerProvider);
    const pasteTextStorage = new PasteTextStorage(s3Provider);

    const userFactory = new UserFactory();
    const pasteFactory = new PasteFactory();
    const redisProvider = new RedisProvider(redisClient);
    const cacheProvider = new CacheProvider(redisProvider);
    const urlFactory = new UrlFactory();
    const dbProvider = new DBProvider({ pool });
    const userRepository = new UserRepository({ dbProvider, userFactory });
    const pasteRepository = new PasteRepository({ dbProvider, pasteFactory, cacheProvider });
    const urlRepository = new UrlRepository({ dbProvider, urlFactory });
    const idGenerator = new IdGenerator({ uuid: uuidv4 });
    const getUserResponseBuilder = new GetUserResponseBuilder();
    const searchUserResponseBuilder = new SearchUserResponseBuilder();
    const getPasteResponseBuilder = new GetPasteResponseBuilder();
    const searchPasteResponseBuilder = new SearchPasteResponseBuilder();
    const createUrlResponseBuilder = new CreateUrlResponseBuilder();
    const getPasteByHashResponseBuilder = new GetPasteByHashResponseBuilder();
    const loginResponseBuilder = new LoginResponseBuilder();
    const registerResponseBuilder = new RegisterResponseBuilder();
    const authTokenService = new AuthTokenService(jwt);
    const passwordHashService = new PasswordHashService(bcrypt);
    const pasteStatisticsService = new PasteStatisticsService(pasteRepository);

    const logger = loggerProvider.create('Logger');
    await redisClient.connect();

    const userRoutes = new UserRouterBuilder({
        express,
        userRepository,
        userFactory,
        idGenerator,
        getUserResponseBuilder,
        searchUserResponseBuilder,
        loginResponseBuilder,
        registerResponseBuilder,
        loggerProvider,
        passwordHashService,
        authTokenService
    });
    const pasteRoutes = new PasteRouterBuilder({
        express,
        pasteRepository,
        pasteFactory,
        idGenerator,
        getPasteResponseBuilder,
        searchPasteResponseBuilder,
        urlRepository,
        getPasteByHashResponseBuilder,
        authTokenService,
        loggerProvider,
        userFactory,
        userRepository,
        pasteStatisticsService,
        pasteTextStorage
    });
    const urlRoutes = new UrlRouterBuilder({
        express,
        urlRepository,
        urlFactory,
        pasteRepository,
        authTokenService,
        createUrlResponseBuilder,
        idGenerator,
        loggerProvider,
        pasteFactory
    });

    app.use(express.json());
    app.use(cors());
    app.use('/user', userRoutes.createRoutes());
    app.use('/paste', pasteRoutes.createRoutes());
    app.use('/url', urlRoutes.createRoutes());

    app.listen(3000, logger.info('App is running.'));
})();
