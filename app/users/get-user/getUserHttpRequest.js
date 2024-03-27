class GetUserHttpRequest {
    constructor(request) {
        this.id = request.params.userId;
        //this.userId = request.user.id;
    }
}

module.exports = GetUserHttpRequest;
