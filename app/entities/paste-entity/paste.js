class Paste {
    constructor ({data, visibility}) {
        this._id = data.id;
        this._name = data.name;
        this._text = data.text;
        this._expiresAfter = data.expiresAfter;
        this._visibility = visibility;
        this._authorId = authorId;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getText() {
        return this._text;
    }

    getExpiration() {
        return this._expiresAfter;
    }

    getVisibility() {
        return this._visibility;
    }

    getAuthorId() {
        return this._authorId;
    }

}

module.exports = Paste;