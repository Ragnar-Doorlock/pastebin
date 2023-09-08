class LoginHttpRequest {
    constructor(request) {
        this.login = request.body.login;
        this.password = request.body.password;
    }
}

module.exports = LoginHttpRequest;
