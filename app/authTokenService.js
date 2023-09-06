class AuthTokenService {
    constructor(jwt) {
        this.jwt = jwt;
    }

    sign(data) {
        const token = this.jwt.sign(
            data,
            process.env.SECRET_KEY,
            {
                expiresIn: process.env.DEFAULT_ACCESS_TOKEN_EXPIRES_AFTER_HOURS
            }
        );

        return token;
    }

    verify(token) {
        return this.jwt.verify(token, process.env.SECRET_KEY);
    }
}

module.exports = AuthTokenService;
