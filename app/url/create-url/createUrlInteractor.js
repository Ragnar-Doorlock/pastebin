const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
require('dotenv').config({path: '../../../.env'});

class CreateUrlInteractor {
    constructor ({presenter, validator, urlRepository, urlFactory, jwt, pasteRepository, responseBuilder}) {
        this.presenter = presenter;
        this.validator = validator;
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.pasteRepository = pasteRepository;
        this.jwt = jwt;
        this.responseBuilder = responseBuilder;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = await this.pasteRepository.findById({id: request.pasteId}); 

        if (!paste) {
            this.presenter.presentFailure(new NotFound(`Paste with id ${request.pasteId} doesn't exist`));
            return;
        }

        const hash = this.jwt.sign({id: request.pasteId, expiresAt: Date.now() + new Date(request.expiresAfterMs), 
            visibility: paste._visibility}, process.env.SECRET_KEY, {expiresIn: request.expiresAfterMs});

        const url = this.urlFactory.create({pasteId: request.pasteId, hash});
        await this.urlRepository.save(url);

        this.presenter.presentSuccess(this.responseBuilder.build(url));
    }
}

module.exports = CreateUrlInteractor;