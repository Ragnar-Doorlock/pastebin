const UserFactory = require('../entities/user-entity/userFactory');
const userFactory = new UserFactory();

class UserRepository {
    constructor ({ dbProvider }) {
        this.dbProvider = dbProvider;
    }

    async findByID({ id }) {
        const result = await this.findOne({ id });
        return result;
    }

    async findOne({ id, name }) {
        const result = await this.findAll({ ids: id, name });

        return result.length > 0 ? result[0] : null;
    }

    async findAll({ ids, name }) {
        const itemsToFind = [];

        if ( ids ) {
            const stringIds = ids.map(x => `'${x}'`);
            itemsToFind.push(`id in (${stringIds.join(', ')})`);
        }

        if( name ) {
            itemsToFind.push(`name='${name}'`);
        }

        //console.log(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`);
        const queryResult = await this.dbProvider.execute(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`); 

        if(!queryResult) {
            return null;
        }

        const result = queryResult.map(x => userFactory.create( x ));
        return result;
    }

    async save(user) {
        if (!user) {
            return;
        }
        
        await this.dbProvider.execute(`insert into users (id, name) values ('${user.getId()}'::varchar(60), '${user.getName()}') ON CONFLICT (id) DO UPDATE set name='${user.getName()}'`);
    }

    /* async update({ id, newName }) {
        await this.dbProvider.execute(`update users set name='${newName}' where id=${id};`);
    } */

    async delete(id) {
        await this.dbProvider.execute(`delete from users where id=${id}`);
    }
}

module.exports = UserRepository;