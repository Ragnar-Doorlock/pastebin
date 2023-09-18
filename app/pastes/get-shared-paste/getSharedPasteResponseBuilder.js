class GetSharedPasteResponseBuilder {
    build(entity) {
        return {
            id: entity.getId(),
            name: entity.getName(),
            text: entity.getText(),
            expiresAfter: entity.getExpiration(),
            visibility: entity.getVisibility(),
            authorId: entity.getAuthorId(),
            createdAt: entity.getCreatedAt(),
            updatedAt: entity.getUpdatedAt(),
            deletedAt: entity.getDeletedAt(),
            totalViews: entity.getTotalViews()
        };
    }
}

module.exports = GetSharedPasteResponseBuilder;
