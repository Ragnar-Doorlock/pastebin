class DeleteUserHttpRequest {
    constructor(request) {
        this.id = request.params.userId;
        this.user = request.user;
    }
}

module.exports = DeleteUserHttpRequest;
