class UpdatePasteHttpRequest {
    constructor(request) {
        this.id = request.params.pasteId;
        this.name = request.body.name;
        this.text = request.body.text;
        this.visibility = request.body.visibility;
    }
}

module.exports = UpdatePasteHttpRequest;
