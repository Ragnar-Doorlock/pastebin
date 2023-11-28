const jwt = require('jsonwebtoken');

module.exports = async (request, response, next) => {
    if (request.body.id || request.body.name || request.body.authorId || request.body.visibility) {
        next();
        return;
    }

    try {
        const token = request.header('x-auth-token');
        if (!token) {
            response.status(403).send('Access denied.');
            return;
        }
        //console.log(await jwt.decode(token, process.env.SECRET_KEY));
        request.body.authorId = await jwt.decode(token, process.env.SECRET_KEY).id;
        next();
    } catch (error) {
        response.status(400).send('Invalid token');
    }
};
