class HttpPresenter {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    presentSuccess(response) {
        if (response) {
            this.response.status(200).send(response);
            return;
        }

        this.response.sendStatus(200);
    }

    presentFailure(error) {
        // error.httpCode = undefined in case something went wrong in code and i get typeError or other errors
        this.response.status(error.httpCode).send({ message: error.message });
    }
}

module.exports = HttpPresenter;
