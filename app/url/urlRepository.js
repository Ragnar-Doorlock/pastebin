class UrlRepository {
    constructor({ dbProvider, urlFactory, jwt }) {
        this.dbProvider = dbProvider;
        this.urlFactory = urlFactory;
    }

    async findById( {pasteId} ) {
        const result = await this.findOne({ pasteId });
        return result;
    }

    async findOne({pasteId, hash}) {
        const searchItems = {};

        if (pasteId) {
            searchItems.pasteIds = [pasteId];
        }

        if (hash) {
            searchItems.hash = hash;
        }

        const result = await this.findAll(searchItems);
        return result.length > 0 ? result[0] : null;
    }

    async findAll({ pasteIds, hash }) {
        const itemsToFind = [];

        if(pasteIds) {
            const stringPasteIds = pasteIds.map(x => `'${x}'`);
            itemsToFind.push(`paste_id in (${stringPasteIds.join(', ')})`);
        }

        if(hash) {
            itemsToFind.push(`hash='${hash}'`);
        }

        //console.log(`SELECT * FROM url WHERE ${itemsToFind.join(' AND ')}`)
        const queryResult = await this.dbProvider.execute(`SELECT * FROM url WHERE ${itemsToFind.join(' AND ')}`); 

        if(!queryResult) {
            return null;
        }

        return queryResult.map(x => this.urlFactory.create({ pasteId: x.paste_id, hash: x.hash }));
    }

    async save(data) {
        await this.dbProvider.execute(`insert into url (paste_id, url_id) values ('${data.getPasteId()}', 
            '${data.geturlId()}')`);
    }

    async delete(pasteID) {
        await this.dbProvider.execute(`delete from url WHERE paste_id='${pasteID}'`);
    }

}

module.exports = UrlRepository;