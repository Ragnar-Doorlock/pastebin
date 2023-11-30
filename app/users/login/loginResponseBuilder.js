class LoginResponseBuilder {
    build(user) {
        return {
            userId: user.getId(),
            accessToken: user.getToken()
        };
    }
}

module.exports = LoginResponseBuilder;
