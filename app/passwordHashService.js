const SALT_ROUNDS = 11;

class PasswordHashService {
    constructor(bcrypt) {
        this.bcrypt = bcrypt;
    }

    async hash(password) {
        return this.bcrypt.hash(password, SALT_ROUNDS);
    }

    async compare(password, hash) {
        return this.bcrypt.compare(password, hash);
    }
}

module.exports = PasswordHashService;
