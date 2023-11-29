class RegisterUserResponseBuilder {
    build(token) {
        return { accessToken: token };
    }
}

module.exports = RegisterUserResponseBuilder;
