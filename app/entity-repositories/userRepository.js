class UserRepository {
    constructor ({pool}) {
        this.pool = pool;
    }

    async findByID({ id }) {
        const result = await this.findOne({ id });
        return result;
    }

    async findOne({ id, name }) {
       
        if ( id ) {
            const result = await this.pool.query(`SELECT * FROM users WHERE id=${id}`);
            await this.pool.end();
            return result.rows[0];
        }

        if( name ) {
            const result = await this.pool.query(`SELECT * FROM users WHERE name='${name}' limit 1`);
            await this.pool.end();
            return result.rows[0];
        }

    }

    async findAll({ id, name }) {

        if ( id ) {
            const result = await this.pool.query(`SELECT * FROM users WHERE id=${id}`);
            await this.pool.end();
            return result.rows[0];
        }

        if( name ) {
            const result = await this.pool.query(`SELECT * FROM users WHERE name='${name}'`);
            await this.pool.end();
            return result.rows[0];
        }
        
    }

    async create(name) {
        await this.pool.query(`insert into users (name) values ('${name}')`);
        await this.pool.end();
    }

    async update({ id, newName }) {
        await this.pool.query(`update users set name='${newName}' where id=${id};`);
        await this.pool.end();
    }

    // should i add deleting pastes after deleting user or is it ok
    // to leave pastes of deleted users?
    async delete({ id }) {
        await this.pool.query(`delete from users where id=${id}`);
        await this.pool.end();
    }
}

module.exports = UserRepository;