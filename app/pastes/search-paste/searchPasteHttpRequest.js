class SearchPasteHttpRequest {
    constructor(request) {
        this.id = request.body.id;
        this.name = request.body.name;
        this.authorId = request.body.authorId;
    }
}

module.exports = SearchPasteHttpRequest;
