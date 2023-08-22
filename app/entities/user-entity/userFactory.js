const User = require('./user');

class UserFactory {
    create(data) {
        return new User(data);
    }
}

module.exports = UserFactory;
