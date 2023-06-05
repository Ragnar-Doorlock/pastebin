class Url {
    constructor(data) {
        this.hash = data.hash;
    }

    async getHash() {
        return this.hash;
    }
    
}

module.exports = Url;