class PasteReository {
    constructor ({ dbProvider }) {
        this.dbProvider = dbProvider;
    }

    async findByID({ id }) {

        const result = await this.findOne({ id });
        return result;

    }

    async findOne({ id, name, authorID }) {
        
        const result = await this.findAll({ id, name, authorID });
        return result[0];

    }

    async findAll({ id, name, authorID}) {

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

        if( authorID ) {
            itemsToFind.push(`author_id=${authorID}`);
        }
        
        const result = await this.dbProvider.execute(`SELECT * FROM paste WHERE ${itemsToFind.join(' OR ')}`);
        return result;

    }

    async create({ name, text, expiresAfter, visibility, authorID}) {

        await this.dbProvider.execute(`insert into paste (name, text, expires_after, visibility, author_id, created_at) values 
            ('${name}', '${text}', '${expiresAfter}', '${visibility}', ${authorID}, current_timestamp)`);
        
    }

    async update({id, name, text, visibility}) {

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

        await this.dbProvider.execute(`update paste set ${itemsToUpdate.join(', ')} updated_at=current_timestamp where id=${id};`);
        
    }

    async delete({ id }) {

        await this.dbProvider.execute(`update paste set deleted_at=current_timestamp where id=${id};`);
        
    }
}

module.exports = PasteReository;