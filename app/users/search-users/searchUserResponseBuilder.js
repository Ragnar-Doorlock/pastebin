class SearchUserResponseBuilder {
    build(entities) {
        return entities.map(x => ({id: x.getId(), name: x.getName()}));
    }
}

module.exports = SearchUserResponseBuilder;