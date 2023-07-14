class DBProvider {
    constructor({ pool }) {
        this.pool = pool;
    }

    async execute(query) {
        const result = await this.pool.query(query);
        return result.rows;
    }
}

module.exports = DBProvider;