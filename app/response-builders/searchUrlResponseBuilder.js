class SearchUrlResponseBuilder {
    build(entities) {
        return entities.map(x => ({pasteId: x.getPasteId(), hash: x.getHash()}));
    }
}

module.exports = SearchUrlResponseBuilder;