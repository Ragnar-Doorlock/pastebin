class RedisProvider {
    constructor(client) {
        this.client = client;
    }

    async set(key, value) {
        await this.client.set(key, value, 'EX', 3600);
    }

    async get(key) {
        return await this.client.get(key);
    }

    async exists(key) {
        return this.client.exists(key);
    }

    async clear() {
        await this.client.FLUSHDB();
    }

    async deleteKey(key) {
        await this.client.del(key);
    }
}

module.exports = RedisProvider;
