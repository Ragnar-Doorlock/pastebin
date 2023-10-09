class S3Provider {
    constructor(s3Client, loggerProvider) {
        this.client = s3Client;
        this.logger = loggerProvider.create(S3Provider.name);
    }

    async putObject(key, body) {
        try {
            await this.client.putObject({ Bucket: 'pastebin', Key: key, Body: body });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getObject(key) {
        const data = await this.client.getObject({ Bucket: 'pastebin', Key: key });
        const result = data.Body.transformToString();
        return result;
    }

    async deleteObject(key) {
        await this.client.deleteObject({ Bucket: 'pastebin', Key: key });
    }
}

module.exports = S3Provider;
