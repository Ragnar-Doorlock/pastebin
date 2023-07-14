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
            const arrayOfIDs = [];

            if (ids.length > 1) {

                for (let i = 0; i < ids.length; i++) {
                    arrayOfIDs.push(ids[i]);
                }

                itemsToFind.push(`id in (${arrayOfIDs.join(', ')})`);

            } else {
                itemsToFind.push(`id in (${ids})`);
            }
        }

        if( name ) {
            itemsToFind.push(`name='${name}'`);
        }

        //console.log(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`);
        const queryResult = await this.dbProvider.execute(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`); 

        if(!queryResult) {
            return null;
        }

        const result = queryResult.map(x => userFactory.create({ data: x }));
        return result;
    }

    async create(name) {
        if (!name) {
            return;
        }

        await this.dbProvider.execute(`insert into users (name) values ('${name}')`);
    }

    async update({ id, newName }) {
        await this.dbProvider.execute(`update users set name='${newName}' where id=${id};`);
    }

    async delete(id) {
        await this.dbProvider.execute(`delete from users where id=${id}`);
    }
}

module.exports = UserRepository;