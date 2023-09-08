class RegisterUserHttpRequest {
    constructor(request) {
        this.name = request.body.name;
        this.login = request.body.login;
        this.password = request.body.password;
    }
}

module.exports = RegisterUserHttpRequest;
