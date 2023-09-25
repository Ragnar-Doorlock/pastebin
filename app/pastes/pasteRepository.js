class PasteRepository {
    constructor({ dbProvider, pasteFactory, cacheProvider }) {
        this.dbProvider = dbProvider;
        this.pasteFactory = pasteFactory;
        this.cacheProvider = cacheProvider;
    }

    async findById({ id }) {
        const isPasteCached = await this.cacheProvider.exists(`cached_${id}`);
        if (isPasteCached) {
            const cachedData = JSON.parse(await this.cacheProvider.get(`cached_${id}`));
            //console.log('cache is used');
            return this.pasteFactory.create({
                id: cachedData._id,
                name: cachedData._name,
                text: cachedData._text,
                expiresAfter: cachedData._expiresAfter,
                visibility: cachedData._visibility,
                authorId: cachedData._authorId,
                createdAt: cachedData._createdAt,
                updatedAt: cachedData._updatedAt,
                deletedAt: cachedData._deletedAt,
                totalViews: cachedData._totalViews
            });
        }

        const result = await this.findOne({ id });

        await this.cacheProvider.set(`cached_${id}`, JSON.stringify(result));
        return result;
    }

    async findOne({ id, name, authorId }) {
        const ids = id && [id];
        const result = await this.findAll({ ids, name, authorId });
        return result.length > 0 ? result[0] : null;
    }

    async findAll({ ids, name, authorId }) {
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

    async updateViews(pasteId) {
        const query = `update paste set total_views = total_views + 1 where id='${pasteId}'`;
        await this.dbProvider.execute(query);
    }

    async delete(id) {
        await this.dbProvider.execute(`update paste set deleted_at=current_timestamp where id='${id}';`);
        await this.cacheProvider.clear();
    }
}

module.exports = PasteRepository;
