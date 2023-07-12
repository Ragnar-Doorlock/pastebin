const PasteFactory = require('../entities/paste-entity/pasteFactory');

class PasteRepository {
    constructor ({ dbProvider }) {
        this.dbProvider = dbProvider;
        this.pasteFactory = new PasteFactory();
    }

    async findByID({ id }) {

        const result = await this.findOne({ id });
        return result;

    }

    async findOne({ id, name, authorID }) {
        
        const result = await this.findAll({ ids: id, name, authorID });
        
        return result.length > 0 ? result[0] : null;

    }

    async findAll({ ids, name, authorID}) {

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

        if( authorID ) {
            itemsToFind.push(`author_id=${authorID}`);
        }
        
        //console.log(`SELECT * FROM paste WHERE ${itemsToFind.join(' AND ')}`);
        const queryResult = await this.dbProvider.execute(`SELECT * FROM paste WHERE ${itemsToFind.join(' AND ')}`);

        if(!queryResult) {
            return null;
        }

        const result = [];

        for (let i = 0; i < queryResult.length; i++) {
            result.push(this.pasteFactory.create({ data: queryResult[i], visibility: queryResult[i].visibility }));
        }

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

    async delete(id) {

        await this.dbProvider.execute(`update paste set deleted_at=current_timestamp where id=${id};`);
        
    }
}

module.exports = PasteRepository;