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

        if(!result) {
            return null;
        }

        return result[0];

    }

    async findAll({ id, name }) {

        if ( !id && !name ) {
            return;
        }

        const itemsToFind = [];

        if ( id ) {

            const arrayOfIDs = [];

            if (Array.isArray(id)) {

                for (let i = 0; i < id.length; i++) {
                    arrayOfIDs.push(id[i]);
                }

                itemsToFind.push(`id in (${arrayOfIDs.join(', ')})`); // 

            } else {

                itemsToFind.push(`id in (${id})`);

            }
        }

        if( name ) {
            itemsToFind.push(`name='${name}'`);
        }

        //console.log(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`);
        const result = await this.dbProvider.execute(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`); 

        if(!result) {
            return null;
        }

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