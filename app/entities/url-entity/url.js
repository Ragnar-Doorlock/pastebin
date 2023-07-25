class Url {
    constructor(data) {
        this._pasteId = data.pasteId;
        this._hash = data.hash;
    }

    getPasteId() {
        return this._pasteId;
    }

    getHash() {
        return this._hash;
    }
}

module.exports = Url;