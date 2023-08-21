class UserRepository {
    constructor ({ dbProvider, userFactory }) {
        this.dbProvider = dbProvider;
        this.userFactory = userFactory;
    }

    async findByID({ id }) {
        const result = await this.findOne({ id });
        return result;
    }

    async findOne({ id, name }) {
        const result = await this.findAll({ ids: [id], name });

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

        const result = queryResult.map(x => this.userFactory.create( x ));
        return result;
    }

    async save(user) {        
        await this.dbProvider.execute(`
            insert into users (id, name) 
            values ('${user.getId()}', '${user.getName()}') 
            ON CONFLICT (id) DO UPDATE set name='${user.getName()}'
        `);
    }

    async delete(id) {
        //console.log(`delete from users where id='${id}'`);
        await this.dbProvider.execute(`delete from users where id='${id}'`);
    }
}

module.exports = UserRepository;