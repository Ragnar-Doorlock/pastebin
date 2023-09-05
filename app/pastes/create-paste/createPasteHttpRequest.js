class CreatePasteHttpRequest {
    constructor(request) {
        this.name = request.body.name;
        this.text = request.body.text;
        this.expiresAfter = request.body.expiresAfter;
        this.visibility = request.body.visibility;
        this.authorId = request.body.authorId;
        this.user = request.user;
    }
}

module.exports = CreatePasteHttpRequest;
