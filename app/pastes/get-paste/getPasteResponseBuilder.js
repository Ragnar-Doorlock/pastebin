class GetPasteResponseBuilder {
    build({ entity, text }) {
        return {
            id: entity.getId(),
            name: entity.getName(),
            text,
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

module.exports = GetPasteResponseBuilder;
