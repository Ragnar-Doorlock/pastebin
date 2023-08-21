class GetUserResponseBuilder {
    build(entity) {
        return {id: entity.getId(), name: entity.getName()};
    }
}

module.exports = GetUserResponseBuilder;