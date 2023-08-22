class CreateUrlHttpRequest {
    constructor(request) {
        this.pasteId = request.body.pasteId;
        this.expiresAfterMs = request.body.expiresAfterMs;
    }
}

module.exports = CreateUrlHttpRequest;
