class UrlRepository {
    constructor({ dbProvider }) {
        this.dbProvider = dbProvider;
    }

    async getUrl({baseUrl, pasteID}) {

        const result = await this.dbProvider.execute(`SELECT hash FROM url WHERE paste_id=${pasteID}`);

        if(!result) {
            return null;
        }

        return baseUrl + result;

    }

    async createHash({pasteID}) {
        
        await this.dbProvider.execute(`insert into url (paste_id, hash) values (${pasteID}, '[fake-url-hash]')`); //fake hash for now

    }

    async getPasteIdByHash({hash}) {

        const result = await this.dbProvider.execute(`SELECT paste_id FROM url WHERE hash='${hash}'`);

        if(!result) {
            return null;
        }
        
        return result;

    }

    async deleteHash({pasteID}) {

        await this.dbProvider.execute(`delete from url WHERE paste_id=${pasteID}`);

    }

}

module.exports = UrlRepository;