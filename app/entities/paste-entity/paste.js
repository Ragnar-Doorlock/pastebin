class Paste {
    constructor (data) {
        this._id = data.id;
        this._name = data.name;
        this.text = data.text;
        this.expiration = data.expiration;
        this.visibility = data.visibility;
    }

    async getId() {
        return this._id;
    }

    async getName() {
        return this._name;
    }

    async getText() {
        return this.text;
    }

    async getExpiration() {
        return this.expiration;
    }

    async getVisibility() {
        return this.visibility;
    }

}

module.exports = Paste;