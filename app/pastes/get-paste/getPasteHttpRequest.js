class GetPasteHttpRequest {
    constructor(request) {
        this.id = request.params.pasteId;
        this.user = request.user;
    }
}

module.exports = GetPasteHttpRequest;
