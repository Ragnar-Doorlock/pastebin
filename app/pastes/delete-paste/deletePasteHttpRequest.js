class DeletePasteHttpRequest {
    constructor (request) {
        this.id = request.params.pasteId;
    }
}

module.exports = DeletePasteHttpRequest;