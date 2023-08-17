const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class CreateUrlInteractor {
    constructor ({presenter, validator, urlRepository, urlFactory, jwt, pasteRepository, responseBuilder, idGenerator}) {
        this.presenter = presenter;
        this.validator = validator;
        this.urlRepository = urlRepository;
        this.urlFactory = urlFactory;
        this.pasteRepository = pasteRepository;
        this.jwt = jwt;
        this.responseBuilder = responseBuilder;
        this.idGenerator = idGenerator;
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

        const hash = this.jwt.sign({id: request.pasteId, visibility: paste._visibility}, process.env.SECRET_KEY, {expiresIn: +request.expiresAfterMs});

        const url = this.urlFactory.create({pasteId: request.pasteId, urlId: this.idGenerator.generate('url') });
        await this.urlRepository.save(url);

        this.presenter.presentSuccess(this.responseBuilder.build(hash));
    }
}

module.exports = CreateUrlInteractor;