class AuthTokenService {
    constructor(jwt) {
        this.jwt = jwt;
    }

    async sign(data) {
        const token = await this.jwt.sign(
            data,
            process.env.SECRET_KEY,
            {
                expiresIn: process.env.DEFAULT_ACCESS_TOKEN_EXPIRES_AFTER_HOURS
            }
        );

        return token;
    }

    async verify(token) {
        return await this.jwt.verify(token, process.env.SECRET_KEY);
    }
}

module.exports = AuthTokenService;
