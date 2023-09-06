class DeletePasteHttpRequest {
    constructor(request) {
        this.id = request.params.pasteId;
        this.user = request.user.id;
    }
}

module.exports = DeletePasteHttpRequest;
