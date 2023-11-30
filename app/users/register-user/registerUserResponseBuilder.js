class RegisterUserResponseBuilder {
    build(user) {
        return {
            userId: user.getId(),
            accessToken: user.getToken()
        };
    }
}

module.exports = RegisterUserResponseBuilder;
