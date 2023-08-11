class DeleteUrlHttpRequest {
    constructor (request) {
        this.pasteId = request.params.pasteId;
    }
}

module.exports = DeleteUrlHttpRequest;