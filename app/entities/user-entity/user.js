class User {
    constructor({data}) {
        this._id = data.id;
        this._name = data.name;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }
    
}

module.exports = User;