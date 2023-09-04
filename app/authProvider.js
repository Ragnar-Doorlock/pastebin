const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (request, response, next) => {
    try {
        const token = request.header('x-auth-token');
        if (!token) return response.status(403).send('Access denied.');

        request.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        response.status(400).send('Invalid token');
    }
};
