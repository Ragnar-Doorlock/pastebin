class HttpPresenter {
    constructor (req, res) {
        this.req = req;
        this.res = res;
    }

    presentSuccess(response) {
        if (response) {
            this.res.status(200).send(response);
            return;
        }

        this.res.sendStatus(200);
    }

    presentFailure(err) {
        this.res.status(err.httpCode).send({message: err.message});
    }
}

module.exports = HttpPresenter;