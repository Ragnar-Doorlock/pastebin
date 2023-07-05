class UserRepository {
    constructor ({ dbProvider }) {
        this.dbProvider = dbProvider;
    }

    async findByID({ id }) {
        const result = await this.findOne({ id });
        return result;
    }

    async findOne({ id, name }) {

        const result = await this.findAll({ id, name });
        return result[0];

    }

    async findAll({ id, name }) {

        if ( !id && !name ) {
            return;
        }

        const itemsToFind = [];

        if ( id ) {
            if (Array.isArray(id)) {
                for (let i = 0; i < id.length; i++) {
                    itemsToFind.push(`id=${id[i]}`);
                }
            } else {
                itemsToFind.push(`id=${id}`);
            }
        }

        if( name ) {
            itemsToFind.push(`name='${name}'`);
        }
        
        // AND makes the query more precise i think
        // but if it has to be that way then i'll change it
        const result = await this.dbProvider.execute(`SELECT * FROM users WHERE ${itemsToFind.join(' OR ')}`); 
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

    // should i add deleting pastes after deleting user or is it ok
    // to leave pastes of deleted users?
    async delete({ id }) {

        await this.dbProvider.execute(`delete from users where id=${id}`);

    }
}

module.exports = UserRepository;