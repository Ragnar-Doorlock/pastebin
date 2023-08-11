class DeleteUserHttpRequest {
    constructor (request) {
        this.id = request.params.userId;
    }
}

module.exports = DeleteUserHttpRequest;