const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');
const DEFAULT_TOKEN_EXPIRES_AFTER_MS= "24 h";

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

        const hash = this.jwt.sign({
            pasteId: request.pasteId, 
            visibility: paste._visibility}, 
            process.env.SECRET_KEY, 
            {expiresIn: DEFAULT_TOKEN_EXPIRES_AFTER_MS}
        );

        const url = this.urlFactory.create({
            pasteId: request.pasteId, 
            id: this.idGenerator.generate('url') 
        });
        await this.urlRepository.save(url);

        this.presenter.presentSuccess(this.responseBuilder.build(hash));
    }
}

module.exports = CreateUrlInteractor;