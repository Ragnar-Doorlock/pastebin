class SearchUserHttpRequest {
    constructor (request) {
        this.id = request.body.id;
        this.name = request.body.name;
    }
}

module.exports = SearchUserHttpRequest;