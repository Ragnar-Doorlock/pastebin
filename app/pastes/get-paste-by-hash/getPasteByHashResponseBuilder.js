class GetPasteByHashResponseBuilder {
    build (entity) {
        return {id: entity.getId(), name: entity.getName(), expiresAfter: entity.getExpiration(), visibility: entity.getVisibility(), 
            authorId: entity.getAuthorId(), createdAt: entity.getCreatedAt(), updatedAt: entity.getUpdatedAt(), deletedAt: entity.getDeletedAt()};
    }
}

module.exports = GetPasteByHashResponseBuilder;