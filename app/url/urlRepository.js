class UrlRepository {
    constructor({ dbProvider, urlFactory }) {
        this.dbProvider = dbProvider;
        this.urlFactory = urlFactory;
    }

    async findById( {pasteId} ) {
        const result = await this.findOne({ pasteId });
        return result;
    }

    async findOne({ pasteId }) {
        const result = await this.findAll({pasteIds: [pasteId]});
        return result.length > 0 ? result[0] : null;
    }

    async findAll({ pasteIds }) {
        const itemsToFind = [];

        if(pasteIds) {
            const stringPasteIds = pasteIds.map(x => `'${x}'`);
            itemsToFind.push(`paste_id in (${stringPasteIds.join(', ')})`);
        }

        //console.log(`SELECT * FROM url WHERE ${itemsToFind.join(' AND ')}`)
        const queryResult = await this.dbProvider.execute(`SELECT * FROM url WHERE ${itemsToFind.join(' AND ')}`); 

        if(!queryResult) {
            return null;
        }

        return queryResult.map(x => this.urlFactory.create({ pasteId: x.paste_id, id: x.url_id })); //
    }

    async save(data) {
        await this.dbProvider.execute(`insert into url (paste_id, url_id) values ('${data.getPasteId()}', '${data.getId()}') 
        ON CONFLICT (paste_id) DO UPDATE set url_id='${data.getId()}'`);
    }

    async delete(pasteID) {
        await this.dbProvider.execute(`delete from url WHERE paste_id='${pasteID}'`);
    }

}

module.exports = UrlRepository;