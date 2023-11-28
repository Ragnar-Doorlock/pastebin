class SearchPasteHttpRequest {
    constructor(request) {
        this.id = request.body.id;
        this.name = request.body.name;
        this.authorId = request.body.authorId;
        this.visibility = request.body.visibility;
    }
}

module.exports = SearchPasteHttpRequest;
