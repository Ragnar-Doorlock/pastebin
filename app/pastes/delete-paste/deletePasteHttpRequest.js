class DeletePasteHttpRequest {
    constructor(request) {
        this.id = request.params.pasteId;
        this.userId = request.user.id;
    }
}

module.exports = DeletePasteHttpRequest;
