const EXPIRATION_SET_TO_SECONDS = 'EX';
const CACHE_EXPIRES_AFTER_SECONDS = 3600;

class RedisProvider {
    constructor(client) {
        this.client = client;
    }

    async set(key, value) {
        await this.client.set(key, value, EXPIRATION_SET_TO_SECONDS, CACHE_EXPIRES_AFTER_SECONDS);
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
