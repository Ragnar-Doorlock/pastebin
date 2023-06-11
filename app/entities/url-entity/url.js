class Url {
    constructor(data) {
        this._hash = data.hash;
    }

    getHash() {
        return this._hash;
    }
    
}

module.exports = Url;