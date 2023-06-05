class User {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._postsList = data.postsList;
    }

    async getId() {
        return this._id;
    }

    async getName() {
        return this._name;
    }
    
    async getPostsList() {
        return this._postsList;
    }
    
}

module.exports = User;