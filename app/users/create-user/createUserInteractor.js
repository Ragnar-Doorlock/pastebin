const ValidationError = require('../../errors/validationError');

class CreateUserInteractor {
    constructor ({presenter, validator, userRepository, userFactory, uuid}) {
        this.presenter = presenter;
        this.validator = validator;
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.uuid = uuid;
    }

    async execute(name) {
        const errors = this.validator.validate(name);

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const user = this.userFactory.create({id: `user-${this.uuid()}`, name});
        await this.userRepository.save(user);

        this.presenter.presentSuccess();
    }
}

module.exports = CreateUserInteractor;