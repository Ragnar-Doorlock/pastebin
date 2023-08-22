const Url = require('./url');

class UrlFactory {
    create(data) {
        return new Url(data);
    }
}

module.exports = UrlFactory;
