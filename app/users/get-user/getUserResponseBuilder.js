class GetUserResponseBuilder {
    build(entity) {
        return {
            id: entity.getId(),
            name: entity.getName(),
            login: entity.getLogin(),
            pastesCreated: entity.getPastesCreatedCount()
        };
    }
}

module.exports = GetUserResponseBuilder;
