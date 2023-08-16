class GetPasteByHashHttpRequest {
    constructor (request) {
        this.hash = request.query.t;
    }
}

module.exports = GetPasteByHashHttpRequest;