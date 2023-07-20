const UrlFactory = require('../entities/url-entity/urlFactory');
const urlFactory = new UrlFactory();

class UrlRepository {
    constructor({ dbProvider }) {
        this.dbProvider = dbProvider;
    }

    async findById( pasteId ) {
        const result = await this.findOne({ pasteId });
        return result;
    }

    async findOne({pasteId, hash}) {
        const result = await this.findAll({ pasteIds: pasteId, hash });
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

        const queryResult = await this.dbProvider.execute(`SELECT * FROM url WHERE ${itemsToFind.join(' AND ')}`); 

        if(!queryResult) {
            return null;
        }

        const result = queryResult.map(x => urlFactory.create({ pasteId: x.paste_id, hash: x.hash }));
        return result;
    }

    async createHash(data) {
        //console.log(`insert into url (paste_id, hash) values ('${data.getPasteId()}'::varchar(40), '${data.getHash()}') ON conflict (paste_id) DO NOTHING`);
        await this.dbProvider.execute(`insert into url (paste_id, hash) values ('${data.getPasteId}'::varchar(60), '${data.getHash}')`);
    }


    // i'll uncomment and change it in case we need it
    /* async findPasteIdByHash({hash}) {
        const result = await this.dbProvider.execute(`SELECT paste_id FROM url WHERE hash='${hash}'`);

        if(!result) {
            return null;
        }
        
        return result;
    } */

    async deleteHash(pasteID) {
        await this.dbProvider.execute(`delete from url WHERE paste_id=${pasteID}`);
    }

}

module.exports = UrlRepository;