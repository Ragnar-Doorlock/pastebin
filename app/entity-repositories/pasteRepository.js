class PasteRepository {
    constructor ({ dbProvider, pasteFactory }) {
        this.dbProvider = dbProvider;
        this.pasteFactory = pasteFactory;
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
            const stringIds = ids.map(x => `'${x}'`);
            itemsToFind.push(`id in (${stringIds.join(', ')})`);
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

        const result = queryResult.map(x => this.pasteFactory.create({ id: x.id, name: x.name, text: x.name, expiresAfter: x.expires_after,
            visibility: x.visibility, authorID: x.author_id, createdAt: x.created_at, updatedAt: x.updated_at, deletedAt: x.deleted_at }));

        return result;
    }

    async save(paste) {
        await this.dbProvider.execute(`insert into paste (id, name, text, expires_after, visibility, author_id, created_at) 
        values ('${paste.getId()}'::varchar(60), '${paste.getName()}', '${paste.getText()}', '${paste.getExpiration()}', '${paste.getVisibility()}', '${paste.getAuthorId()}', current_timestamp) ON conflict (id) 
        DO update set name='${paste.getName()}', text='${paste.getText()}', visibility='${paste.getVisibility()}', updated_at=current_timestamp`);
    }

    async delete(id) {
        await this.dbProvider.execute(`update paste set deleted_at=current_timestamp where id=${id};`);
    }
}

module.exports = PasteRepository;