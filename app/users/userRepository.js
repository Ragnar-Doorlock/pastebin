class UserRepository {
    constructor({ dbProvider, userFactory }) {
        this.dbProvider = dbProvider;
        this.userFactory = userFactory;
    }

    async findByID({ id }) {
        const result = await this.findOne({ id });
        return result;
    }

    async findOne({ id, name, login }) {
        let ids;
        if (id) ids = [id];
        const result = await this.findAll({ ids, name, login }); // if {ids: [id]} then ids are set to [undefined] so i used if in line 14

        return result.length > 0 ? result[0] : null;
    }

    async findAll({ ids, name, login }) {
        const itemsToFind = [];

        if ( ids ) {
            const stringIds = ids.map(x => `'${x}'`);
            itemsToFind.push(`id in (${stringIds.join(', ')})`);
        }

        if ( name ) {
            itemsToFind.push(`name='${name}'`);
        }

        if ( login ) {
            itemsToFind.push(`login='${login}'`);
        }

        //console.log(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`);
        const queryResult = await this.dbProvider.execute(`SELECT * FROM users WHERE ${itemsToFind.join(' AND ')}`);

        if (!queryResult) {
            return null;
        }

        const result = queryResult.map(x => this.userFactory.create( x ));
        return result;
    }

    async save(user) {
        await this.dbProvider.execute(`
            insert into users (id, name, login, password) 
            values ('${user.getId()}', '${user.getName()}', '${user.getLogin()}', '${user.getPassword()}') 
            ON CONFLICT (id) DO UPDATE set name='${user.getName()}', password='${user.getPassword}'
        `);
    }

    async delete(id) {
        //console.log(`delete from users where id='${id}'`);
        await this.dbProvider.execute(`delete from users where id='${id}'`);
    }
}

module.exports = UserRepository;
