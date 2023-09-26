class GetUserResponseBuilder {
    build(entity) {
        return {
            name: entity.getName(),
            pastesCreated: entity.getPastesCreatedCount()
        };
    }
}

module.exports = GetUserResponseBuilder;
