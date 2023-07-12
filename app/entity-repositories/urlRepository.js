const UrlFactory = require('../entities/url-entity/urlFactory');

class UrlRepository {
    constructor({ dbProvider }) {
        this.dbProvider = dbProvider;
        this.urlFactory = new UrlFactory();
    }

    async getUrl({ pasteID }) {

        const queryResult = await this.dbProvider.execute(`SELECT * FROM url WHERE paste_id=${pasteID}`);

        if(!queryResult) {
            return null;
        }

        return this.urlFactory.create({ data: queryResult[0] });

    }

    async createHash({pasteID, hash}) {
        
        await this.dbProvider.execute(`insert into url (paste_id, hash) values (${pasteID}, '${hash}')`);

    }

    async getPasteIdByHash({hash}) {

        const result = await this.dbProvider.execute(`SELECT paste_id FROM url WHERE hash='${hash}'`);

        if(!result) {
            return null;
        }
        
        return result;

    }

    async deleteHash(pasteID) {

        await this.dbProvider.execute(`delete from url WHERE paste_id=${pasteID}`);

    }

}

module.exports = UrlRepository;