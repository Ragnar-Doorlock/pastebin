const ValidationError = require('../../errors/validationError');

class CreateUserInteractor {
    constructor ({presenter, validator, userRepository, userFactory, idGenerator}) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.idGenerator = idGenerator;
    }

    async execute(request) {
        const errors = this.validator.validate(request);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const user = this.userFactory.create({id: this.idGenerator.generate('user'), name: request.name});
        await this.userRepository.save(user);

        this.presenter.presentSuccess();
    }
}

module.exports = CreateUserInteractor;