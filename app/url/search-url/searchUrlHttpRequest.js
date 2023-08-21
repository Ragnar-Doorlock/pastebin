class SearchUrlHttpRequest {
    constructor (request) {
        this.pasteId = request.body.pasteId;
        this.hash = request.body.hash;
    }
}

module.exports = SearchUrlHttpRequest;