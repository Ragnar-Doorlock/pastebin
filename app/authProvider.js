const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        const token = request.header('x-auth-token');
        if (!token) {
            response.status(403).send('Access denied.');
            return;
        }
        request.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        response.status(400).send('Invalid token');
    }
};
