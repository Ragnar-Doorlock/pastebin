class RedisProvider {
    constructor(client) {
        this.client = client;
    }

    async set(key, value) {
        await this.client.set(key, JSON.stringify(value), 'EX', 3600);
    }

    async get(key) {
        return JSON.parse(await this.client.get(key));
    }

    async exists(key) {
        return await this.client.exists(key);
    }

    async clear() {
        await this.client.FLUSHALL();
    }

    async deleteKey(key) {
        await this.client.del(key);
    }
}

module.exports = RedisProvider;
