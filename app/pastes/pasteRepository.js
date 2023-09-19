class PasteRepository {
    constructor({ dbProvider, pasteFactory, cacheProvider }) {
        this.dbProvider = dbProvider;
        this.pasteFactory = pasteFactory;
        this.cacheProvider = cacheProvider;
    }

    async findById({ id }) {
        const result = await this.findOne({ id });
        return result;
    }

    async findOne({ id, name, authorId }) {
        const ids = id && [id];
        const result = await this.findAll({ ids, name, authorId });
        return result.length > 0 ? result[0] : null;
    }

    async findAll({ ids, name, authorId }) {
        const isPasteCached = await this.cacheProvider.exists(`${ids}_${name}_${authorId}`);
        if (isPasteCached) {
            const cachedData = await this.cacheProvider.get(`${ids}_${name}_${authorId}`);
            return this._createPasteEntity(cachedData);
        }

        const itemsToFind = [];

        if ( ids ) {
            const stringIds = ids.map(x => `'${x}'`);
            itemsToFind.push(`id in (${stringIds.join(', ')})`);
        }

        if ( name ) {
            itemsToFind.push(`name='${name}'`);
        }

        if ( authorId ) {
            itemsToFind.push(`author_id='${authorId}'`);
        }

        //console.log(`SELECT * FROM paste WHERE ${itemsToFind.join(' AND ')} AND deleted_at is null`);
        const queryResult = await this.dbProvider.execute(`SELECT * FROM paste WHERE ${itemsToFind.join(' AND ')} AND deleted_at is null`);

        if (!queryResult) {
            return null;
        }

        await this.cacheProvider.set(`${ids}_${name}_${authorId}`, queryResult);

        return this._createPasteEntity(queryResult);
    }

    _createPasteEntity(data) {
        const result = data.map(x => this.pasteFactory.create({
            id: x.id,
            name: x.name,
            text: x.text,
            expiresAfter: x.expires_after,
            visibility: x.visibility,
            authorId: x.author_id,
            createdAt: x.created_at,
            updatedAt: x.updated_at,
            deletedAt: x.deleted_at,
            totalViews: x.total_views
        }));

        return result;
    }

    async save(paste) {
        const expiration = new Date(paste.getExpiration()).toUTCString();

        const query = `
        insert into paste (id, name, text, expires_after, visibility, author_id, created_at, total_views) 
        values ('${paste.getId()}', '${paste.getName()}', '${paste.getText()}', '${expiration}', '${paste.getVisibility()}',
        '${paste.getAuthorId()}', current_timestamp, '${paste.getTotalViews()}') 
        ON conflict (id) DO update set name='${paste.getName()}', 
        text='${paste.getText()}', 
        visibility='${paste.getVisibility()}', 
        updated_at=current_timestamp,
        total_views='${paste.getTotalViews()}'`;

        await this.dbProvider.execute(query);

        await this.cacheProvider.clear();
    }

    async delete(id) {
        await this.dbProvider.execute(`update paste set deleted_at=current_timestamp where id='${id}';`);
        await this.cacheProvider.clear();
    }
}

module.exports = PasteRepository;
