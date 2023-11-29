class CreateUrlResponseBuilder {
    build(hash) {
        return {
            publicUrl: `${process.env.BASE_URL}paste/shared?t=${hash}`
        };
    }
}

module.exports = CreateUrlResponseBuilder;
