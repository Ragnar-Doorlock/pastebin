class GetSharedPasteHttpRequest {
    constructor(request) {
        this.hash = request.query.t;
    }
}

module.exports = GetSharedPasteHttpRequest;
