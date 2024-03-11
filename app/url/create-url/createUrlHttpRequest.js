class CreateUrlHttpRequest {
    constructor(request) {
        this.pasteId = request.body.pasteId;
        this.expiresAfterMs = request.body.expiresAfterMs;
        this.userId = request.user.id;
    }
}

module.exports = CreateUrlHttpRequest;
