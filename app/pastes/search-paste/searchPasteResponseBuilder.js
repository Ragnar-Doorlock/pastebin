class SearchPasteResponseBuilder {
    build(entities) {
        return entities.map(x => ({
            id: x.getId(), 
            name: x.getName(), 
            expiresAfter: x.getExpiration(), 
            visibility: x.getVisibility(), 
            authorId: x.getAuthorId(), 
            createdAt: x.getCreatedAt(), 
            updatedAt: x.getUpdatedAt(), 
            deletedAt: x.getDeletedAt()
        }));
    }
}

module.exports = SearchPasteResponseBuilder;