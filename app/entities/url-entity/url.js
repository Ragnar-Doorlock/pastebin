class Url {
    constructor(data) {
        this._pasteId = data.pasteId;
        this._urlId = data.urlId;
    }

    getPasteId() {
        return this._pasteId;
    }

    geturlId() {
        return this._urlId;
    }
}

module.exports = Url;