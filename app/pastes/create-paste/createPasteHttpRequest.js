class CreatePasteHttpRequest {
    constructor(request) {
        this.name = request.body.name;
        this.text = request.body.text;
        this.expiresAfter = request.body.expiresAfter;
        this.visibility = request.body.visibility;
        this.userId = request.user.id;
    }
}

module.exports = CreatePasteHttpRequest;
