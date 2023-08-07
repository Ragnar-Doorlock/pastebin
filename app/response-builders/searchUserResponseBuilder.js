class SearchUserResponseBuilder {
    build(entities) {
        const result = []
        for (const iterator of entities) {
            result.push({id: iterator.getId(), name: iterator.getName()});
        }
        return result;
    }
}

module.exports = SearchUserResponseBuilder;