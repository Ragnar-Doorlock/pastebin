const Paste = require('./paste');

class PasteFactory {
    create(data) {
        return new Paste(data);
    }
}

module.exports = PasteFactory;
