/* eslint-disable camelcase */
const UserRepository = require('../app/users/userRepository');

describe('UserRepository', () => {
    let dbProviderMock;
    let userFactoryMock;
    let userRepository;

    beforeEach(() => {
        dbProviderMock = {
            execute: jasmine.createSpy()
        };
        userFactoryMock = {
            create: jasmine.createSpy()
        };
        userRepository = new UserRepository({
            dbProvider: dbProviderMock,
            userFactory: userFactoryMock
        });
    });

    describe('findByID()', () => {
        const id = '[fake-id]';
        const name = '[fake-name]';
        const login = '[fake-login]';
        const password = '[hashed-password]';
        const pastes_created_count = '[fake-pastes-count]';

        let userDataFromDB = {};

        beforeEach(() => {
            userDataFromDB = {
                id,
                name,
                login,
                password,
                pastes_created_count,
            };
            dbProviderMock.execute.and.resolveTo([userDataFromDB]);
        });

        it('should execute a proper query', async () => {
            await userRepository.findByID({ id });

            expect(dbProviderMock.execute).toHaveBeenCalledOnceWith(`SELECT * FROM users WHERE id in ('${id}')`);
        });

        it('should use userFactory to reproduce found user', async () => {
            await userRepository.findByID({ id });

            expect(userFactoryMock.create).toHaveBeenCalledOnceWith({
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            });
        });

        it('should return created user', async () => {
            const userEntity = { fake: '[user-entity]' };
            userFactoryMock.create.and.returnValue(userEntity);

            const result = await userRepository.findByID({ id });

            expect(result).toEqual(userEntity);
        });

        it('should return null if no user found', async () => {
            dbProviderMock.execute.and.resolveTo([]);

            const result = await userRepository.findByID({ id });

            expect(result).toBeNull();
        });
    });

    describe('findOne()', () => {
        const id = '[fake-id]';
        const name = '[fake-name]';
        const login = '[fake-login]';
        const password = '[hashed-password]';
        const pastes_created_count = '[fake-pastes-count]';

        let userDataFromDB = {};

        beforeEach(() => {
            userDataFromDB = {
                id,
                name,
                login,
                password,
                pastes_created_count,
            };
            dbProviderMock.execute.and.resolveTo([userDataFromDB]);
        });

        it('should execute a proper query', async () => {
            await userRepository.findOne({ id, name });

            expect(dbProviderMock.execute).toHaveBeenCalledOnceWith(`SELECT * FROM users WHERE id in ('${id}') AND name='${name}'`);
        });

        it('should use userFactory to reproduce found user', async () => {
            await userRepository.findOne({ id, name });

            expect(userFactoryMock.create).toHaveBeenCalledOnceWith({
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            });
        });

        it('should return created user', async () => {
            const userEntity = { fake: '[user-entity]' };
            userFactoryMock.create.and.returnValue(userEntity);

            const result = await userRepository.findOne({ id, name });

            expect(result).toEqual(userEntity);
        });

        it('should return null if no user found', async () => {
            dbProviderMock.execute.and.resolveTo([]);

            const result = await userRepository.findOne({ id, name });

            expect(result).toBeNull();
        });
    });

    describe('findAll()', () => {
        const id = '[fake-id]';
        const name = '[fake-name]';
        const login = '[fake-login]';
        const password = '[hashed-password]';
        const pastes_created_count = '[fake-pastes-count]';

        let userDataFromDB = {};

        beforeEach(() => {
            userDataFromDB = {
                id,
                name,
                login,
                password,
                pastes_created_count,
            };
            dbProviderMock.execute.and.resolveTo([userDataFromDB]);
        });

        it('should execute a proper query', async () => {
            await userRepository.findAll({ ids: [id], name, login });

            expect(dbProviderMock.execute).toHaveBeenCalledOnceWith(`SELECT * FROM users WHERE id in ('${id}') AND name='${name}' AND login='${login}'`);
        });

        it('should use userFactory to reproduce found user', async () => {
            await userRepository.findAll({ ids: [id], name, login });

            expect(userFactoryMock.create).toHaveBeenCalledOnceWith({
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            });
        });

        it('should return created user', async () => {
            const userEntity = { fake: '[user-entity]' };
            userFactoryMock.create.and.returnValue(userEntity);

            const result = await userRepository.findAll({ ids: [id], name, login });

            expect(result).toEqual([userEntity]);
        });

        it('should return null if no users were found', async () => {
            dbProviderMock.execute.and.resolveTo([]);

            const result = await userRepository.findAll({ ids: [id], name, login });

            // doesn't want to work: Expected [  ] to be null.
            // if i use expect(result).toBeNull() it returns error
            expect(result.length).toEqual(0);
        });
    });

    describe('save()', () => {
        let user = {};
        beforeEach(() => {
            user = {
                getId: () => '[fake-id]',
                getName: () => '[fake-name]',
                getLogin: () => '[fake-login]',
                getPassword: () => '[hashed-password]',
                getPastesCreatedCount: () => 5
            };
        });

        it('should check if provided user has created pastes count', async () => {
            const createdPastesCount = user.getPastesCreatedCount();
            expect(createdPastesCount).toEqual(5);
        });

        it('should execute a query with provided data', async () => {
            await userRepository.save(user);

            // different spacing can cause test fails, what's the solution?
            const expectedQuery = `
            insert into users (id, name, login, password) 
            values ('${user.getId()}', '${user.getName()}', '${user.getLogin()}', '${user.getPassword()}') 
            ON CONFLICT (id) DO UPDATE set name='${user.getName()}', password='${user.getPassword()}', pastes_created_count='${user.getPastesCreatedCount()}'`;
            expect(dbProviderMock.execute).toHaveBeenCalledWith(expectedQuery);
        });
    });

    describe('delete()', () => {
        const id = '[fake-id]';
        it('it should execute query to delete data from db', async () => {
            await userRepository.delete(id);
            const expectedQuery = `delete from users where id='${id}'`;
            expect(dbProviderMock.execute).toHaveBeenCalledWith(expectedQuery);
        });
    });
});
