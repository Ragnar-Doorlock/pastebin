class UpdateUserHttpRequest {
    constructor(request) {
        this.id = request.params.userId;
        this.name = request.body.name;
    }
}

module.exports = UpdateUserHttpRequest;
