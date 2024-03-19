/* eslint-disable camelcase */
const UserRepository = require('../app/users/userRepository');

describe('UserRepository', () => {
    let dbProviderMock;
    let userFactoryMock;
    let userRepository;

    beforeEach(() => {
        dbProviderMock = {
            execute: jasmine.createSpy('execute')
        };
        userFactoryMock = {
            create: jasmine.createSpy('create')
        };
        userRepository = new UserRepository({
            dbProvider: dbProviderMock,
            userFactory: userFactoryMock
        });
    });

    describe('findByID()', () => {
        it('should find a user by ID', async () => {
            const id = '[fake-id]';
            const name = '[fake-name]';
            const login = '[fake-login]';
            const password = '[hashed-password]';
            const pastes_created_count = '[fake-pastes-count]';
            const userDataFromDB = {
                id,
                name,
                login,
                password,
                pastes_created_count
            };
            //why remove this? i use it 3 times later in code and it saves lines of code if i use variable?
            const userData = {
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            };
            dbProviderMock.execute.and.resolveTo([userDataFromDB]);
            userFactoryMock.create.and.returnValue(userData);

            const result = await userRepository.findByID({ id });

            expect(dbProviderMock.execute).toHaveBeenCalledWith(`SELECT * FROM users WHERE id in ('${id}')`);
            expect(userFactoryMock.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(userData);
        });

        it('should return null if no user found', async () => {
            const id = '[fake-nonexisting-id]';
            dbProviderMock.execute.and.resolveTo([]);

            const result = await userRepository.findByID({ id });

            expect(dbProviderMock.execute).toHaveBeenCalledWith(`SELECT * FROM users WHERE id in ('${id}')`);
            expect(result).toBeNull();
        });
    });

    describe('findOne()', () => {
        it('should find one user that fits search parameters', async () => {
            const id = '[fake-id]';
            const name = '[fake-name]';
            const login = '[fake-login]';
            const password = '[hashed-password]';
            const pastes_created_count = '[fake-pastes-count]';
            const userDataFromDB = {
                id,
                name,
                login,
                password,
                pastes_created_count
            };
            const userData = {
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            };
            dbProviderMock.execute.and.resolveTo([userDataFromDB]);
            userFactoryMock.create.and.returnValue(userData);

            const result = await userRepository.findOne({ id, name });

            expect(dbProviderMock.execute).toHaveBeenCalledWith(`SELECT * FROM users WHERE id in ('${id}') AND name='${name}'`);
            expect(userFactoryMock.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(userData);
        });
    });

    describe('findAll()', () => {
        it('should find all users that fit search parameters', async () => {
            const id = '[fake-id]';
            const name = '[fake-name]';
            const login = '[fake-login]';
            const password = '[hashed-password]';
            const pastes_created_count = '[fake-pastes-count]';
            const userDataFromDB = {
                id,
                name,
                login,
                password,
                pastes_created_count
            };
            dbProviderMock.execute.and.resolveTo([userDataFromDB]);
            userFactoryMock.create.and.returnValue({
                id: id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            });

            const result = await userRepository.findAll({ ids: [id], name, login });
            expect(dbProviderMock.execute).toHaveBeenCalledWith(`SELECT * FROM users WHERE id in ('${id}') AND name='${name}' AND login='${login}'`);
            expect(userFactoryMock.create).toHaveBeenCalledWith({
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            });
            expect(result).toEqual([{
                id,
                name,
                login,
                password,
                pastesCreatedCount: pastes_created_count
            }]);
        });
    });

    describe('save()', () => {
        it('should save a user', async () => {
            const user = {
                getId: () => '[fake-id]',
                getName: () => '[fake-name]',
                getLogin: () => '[fake-login]',
                getPassword: () => '[hashed-password]',
                getPastesCreatedCount: () => 5
            };

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
        it('it should execute query to delete data from db', async () => {
            const id = '[fake-id]';
            await userRepository.delete(id);
            const expectedQuery = `delete from users where id='${id}'`;
            expect(dbProviderMock.execute).toHaveBeenCalledWith(expectedQuery);
        });
    });
});
