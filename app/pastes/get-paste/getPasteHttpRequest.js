class GetPasteHttpRequest {
    constructor(request) {
        this.id = request.params.pasteId;
    }
}

module.exports = GetPasteHttpRequest;
