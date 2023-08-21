class Url {
    constructor(data) {
        this._pasteId = data.pasteId;
        this._id = data.id;
    }

    getPasteId() {
        return this._pasteId;
    }

    getId() {
        return this._id;
    }
}

module.exports = Url;