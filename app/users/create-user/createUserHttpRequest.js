class CreateUserHttpRequest {
    constructor(request) {
        this.name = request.body.name;
    }
}

module.exports = CreateUserHttpRequest;
