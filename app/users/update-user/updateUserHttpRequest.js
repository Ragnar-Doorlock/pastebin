class UpdateUserHttpRequest {
    constructor(request) {
        this.id = request.params.userId;
        this.name = request.body.name;
        this.password = request.body.password;
        this.user = request.user;
    }
}

module.exports = UpdateUserHttpRequest;
