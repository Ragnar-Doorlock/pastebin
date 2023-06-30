class PasteReository {
    constructor (pool, currentDateAndTime) {
        this.pool = pool;
        this.currentDateAndTime = currentDateAndTime;
    }

    async findByID({ id }) {
        const result = this.findOne({ id });
        return result;
    }

    async findOne({ id, name, authorID }) {
        if ( id ) {
            await this.pool.connect();
            const result = await this.pool.query(`SELECT * FROM paste WHERE id=${id}`);
            await this.pool.end();
            return result;
        }

        if( name ) {
            await this.pool.connect();
            const result = await this.pool.query(`SELECT * FROM paste WHERE name='${name}' limit 1`);
            await this.pool.end();
            return result;
        }

        if( authorID ) {
            await this.pool.connect();
            const result = await this.pool.query(`SELECT * FROM paste WHERE author_id='${authorID}' limit 1`);
            await this.pool.end();
            return result;
        }
    }

    async findAll({ id, name, authorID}) {
        if ( id ) {
            await this.pool.connect();
            const result = await this.pool.query(`SELECT * FROM paste WHERE id=${id}`);
            await this.pool.end();
            return result;
        }

        if( name ) {
            await this.pool.connect();
            const result = await this.pool.query(`SELECT * FROM paste WHERE name='${name}'`);
            await this.pool.end();
            return result;
        }

        if( authorID ) {
            await this.pool.connect();
            const result = await this.pool.query(`SELECT * FROM paste WHERE author_id=${authorID}`);
            await this.pool.end();
            return result;
        }
    }

    // do i need to add methors for getting each field? 
    // basically it should be possible to get from result of paste search

    async create({ name, text, expiresAfter, visibility, authorID}) {
        // expiresAfter and createdAt format: 2023-07-04 12:30:00

        const currentDateAndTime = new Date();
        createdAtTime = currentDateAndTime.toISOString().split('T')[0];

        await this.pool.connect();
        await this.pool.query(`insert into paste (name, text, expires_after, visibility, author_id, created_at) values 
            ('${name}', '${text}', '${expiresAfter}', '${visibility}', ${authorID}, current_timestamp)`); //current_timestamp -> '${this.currentDateAndTime.getDateAndTime()}'
        await this.pool.end();
    }

    async update({id, name, text, visibility}) {
        // expiresAfter and createdAt format: 2023-07-04 12:30:00

        const itemsToUpdate = [];

        if (name) {
            itemsToUpdate.push(`name='${name}'`);
        }

        if (text) {
            itemsToUpdate.push(`text='${text}'`);
        }

        if (visibility) {
            itemsToUpdate.push(`visibility='${visibility}'`);
        }

        await this.pool.connect();
        await this.pool.query(`update paste set ${itemsToUpdate.toString()} updated_at=current_timestamp where id=${id};`);
        await this.pool.end();
    }

    async delete({ id }) {
        await this.pool.connect();
        await this.pool.query(`update paste set deleted_at=current_timestamp where id=${id};`);
        await this.pool.end();
    }
}