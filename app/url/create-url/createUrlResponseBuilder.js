class CreateUrlResponseBuilder {
    build(hash) {
        return `${process.env.BASE_URL}paste/shared?t=${hash}`;
    }
}

module.exports = CreateUrlResponseBuilder;
