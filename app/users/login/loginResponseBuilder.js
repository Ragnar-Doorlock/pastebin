class LoginResponseBuilder {
    build(token) {
        return { accessToken: token };
    }
}

module.exports = LoginResponseBuilder;
