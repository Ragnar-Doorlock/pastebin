class DBProvider {
    constructor({ pool }) {
        this.pool = pool;
    }

    async execute(query) {
        const client = await this.pool.connect();
        const result = await client.query(query);
        //await this.pool.end();

        // now with this thing the app is running for some time after it executed query(-ies) (around 5 secs)
        // but it seems better that pool.end since it doesn't let execute several queries at a time

        await client.release();
        return result.rows;
    }

}

module.exports = DBProvider;