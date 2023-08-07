class IdGenerator {
    constructor ({uuid}) {
        this.uuid = uuid;
    }

    generateUserId() {
        return `user-${this.uuid()}`;
    }

    generatePasteId() {
        return `paste-${this.uuid()}`;
    }
}

module.exports = IdGenerator;