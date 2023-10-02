class S3Provider {
    constructor(s3Client, loggerProvider) {
        this.client = s3Client;
        this.logger = loggerProvider.create(S3Provider.name);
    }

    async putObject(Key, Body) {
        try {
            await this.client.putObject({ Bucket: 'pastebin', Key, Body });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getObject(Key) {
        // not really sure if that is a good approach but it works ( .Body.transformToString(); )
        const data = await this.client.getObject({ Bucket: 'pastebin', Key });
        const result = data.Body.transformToString();
        return result;
    }

    async deleteObject(Key) {
        await this.client.deleteObject({ Bucket: 'pastebin', Key });
    }
}

module.exports = S3Provider;
