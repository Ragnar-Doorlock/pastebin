const UrlFactory = require('../entities/url-entity/urlFactory');
const KebabRemover = require('../kebab-case-remover/kebabRemover');
const urlFactory = new UrlFactory();
const kebabRemover = new KebabRemover();

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
            const arrayOfIDs = [];

            if (pasteIds.length > 1) {

                for (let i = 0; i < pasteIds.length; i++) {
                    arrayOfIDs.push(pasteIds[i]);
                }

                itemsToFind.push(`paste_id in (${arrayOfIDs.join(', ')})`);

            } else {

                itemsToFind.push(`paste_id in (${pasteIds})`);

            }
        }

        if(hash) {
            itemsToFind.push(`hash='${hash}'`);
        }

        const queryResult = await this.dbProvider.execute(`SELECT * FROM url WHERE ${itemsToFind.join(' AND ')}`); 

        if(!queryResult) {
            return null;
        }

        const queryResultKeysToCamel = queryResult.map(x => kebabRemover.execute(x));
        const result = queryResultKeysToCamel.map(x => urlFactory.create( x ));
        return result;
    }

    async createHash({pasteID, hash}) {
        await this.dbProvider.execute(`insert into url (paste_id, hash) values (${pasteID}, '${hash}')`);
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