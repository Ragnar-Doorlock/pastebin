class User {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._login = data.login;
        this._password = data.password;
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
}

module.exports = User;
