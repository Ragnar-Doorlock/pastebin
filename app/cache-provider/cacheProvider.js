class CacheProvider {
    constructor({ client, pasteFactory }) {
        this.client = client;
        this.pasteFactory = pasteFactory;
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
        // seems like this shit works. Finally
        await this.client.FLUSHALL();
    }

    async deleteKey(key) {
        // temporary solution while figuring out for full cache flush
        await this.client.del(key);
    }
}

module.exports = CacheProvider;
