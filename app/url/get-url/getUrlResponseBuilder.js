class GetUrlResponseBuilder {
    build(entity) {
        return {pasteId: entity.getPasteId(), hash: entity.getHash()};
    }
}

module.exports = GetUrlResponseBuilder;