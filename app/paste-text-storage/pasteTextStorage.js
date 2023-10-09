class PasteTextStorage {
    constructor(s3Provider) {
        this.storage = s3Provider;
    }

    async saveText(id, text) {
        await this.storage.putObject(id, text);
    }

    async getText(id) {
        return this.storage.getObject(id);
    }

    async deleteText(id) {
        await this.storage.deleteObject(id);
    }
}

module.exports = PasteTextStorage;

