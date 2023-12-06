class User {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._login = data.login;
        this._password = data.password;
        this._pastesCreatedCount = data.pastesCreatedCount;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getLogin() {
        return this._login;
    }

    getPassword() {
        return this._password;
    }

    getPastesCreatedCount() {
        return this._pastesCreatedCount;
    }

    increasePastesCreatedCount() {
        this._pastesCreatedCount += 1;
    }

    changeName(newName) {
        this._name = newName;
    }
}

module.exports = User;
