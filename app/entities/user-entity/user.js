class User {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._login = data.login;
        this._password = data.password;
        this._pastesCreatedCount = data.pastesCreatedCount;
        this._accessToken = data._accessToken;
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

    setToken(token) {
        this._accessToken = token;
    }

    getToken() {
        return this._accessToken;
    }
}

module.exports = User;
