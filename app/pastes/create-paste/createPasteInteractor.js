const ValidationError = require('../../errors/validationError');

class CreatePasteInteractor {
    constructor({ presenter, validator, pasteRepository, pasteFactory, idGenerator, userFactory, userRepository }) {
        this.presenter = presenter;
        this.validator = validator;
        this.pasteRepository = pasteRepository;
        this.pasteFactory = pasteFactory;
        this.idGenerator = idGenerator;
        this.userFactory = userFactory;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const paste = this.pasteFactory.create({
            id: this.idGenerator.generate('paste'),
            name: request.name,
            text: request.text,
            visibility: request.visibility,
            expiresAfter: request.expiresAfter,
            authorId: request.userId,
            totalViews: 0
        });
        await this.pasteRepository.save(paste);

        const user = await this.userRepository.findByID({ id: request.userId });
        user.increasePastesCreatedCount();
        await this.userRepository.save(user);

        this.presenter.presentSuccess();
    }
}

module.exports = CreatePasteInteractor;
