class Paste {
    constructor ({data, visibility}) {
        this._id = data.id;
        this._name = data.name;
        this._text = data.text;
        this._expiresAfter = data.expiresAfter;
        this._visibility = visibility;
        this._authorId = data.authorId;
        this._createdAt = data.createdAt;
        this._updatedAt = data.updatedAt;
        this._deletedAt = data.deletedAt;
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

    getCreatedAt() {
        return this._createdAt;
    }

    getUpdatedAt() {
        return this._updatedAt;
    }

    getDeletedAt() {
        return this._deletedAt;
    }

}

module.exports = Paste;