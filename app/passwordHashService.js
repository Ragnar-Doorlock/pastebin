const SALT_ROUNDS = 11;

class PasswordHashService {
    constructor(bcrypt) {
        this.bcrypt = bcrypt;
    }

    async hash(password) {
        return await this.bcrypt.hash(password, SALT_ROUNDS);
    }

    async compare(password, hash) {
        return await this.bcrypt.compare(password, hash);
    }
}

module.exports = PasswordHashService;
