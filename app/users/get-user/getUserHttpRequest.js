class GetUserHttpRequest {
    constructor (request) {
        this.id = request.params.userId;
    }
}

module.exports = GetUserHttpRequest;