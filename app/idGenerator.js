class IdGenerator {
    constructor({ uuid }) {
        this.uuid = uuid;
    }

    generate(string) {
        return `${string}-${this.uuid()}`;
    }
}

module.exports = IdGenerator;
