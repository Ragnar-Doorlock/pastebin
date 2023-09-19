class CacheProvider {
    constructor(client) {
        this.cache = client;
    }

    async set(key, value) {
        await this.cache.set(key, value);
    }

    async get(key) {
        return await this.cache.get(key);
    }

    async exists(key) {
        return await this.cache.exists(key);
    }

    async clear() {
        await this.cache.clear();
    }

    async deleteKey(key) {
        await this.cache.deleteKey(key);
    }
}

module.exports = CacheProvider;
