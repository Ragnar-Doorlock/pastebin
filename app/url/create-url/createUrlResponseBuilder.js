require('dotenv').config({path: '../../../.env'});

class CreateUrlResponseBuilder {
    build (url) {
        return `${process.env.BASE_URL}shared?t=${url.getHash()}`;
    }
}

module.exports = CreateUrlResponseBuilder;