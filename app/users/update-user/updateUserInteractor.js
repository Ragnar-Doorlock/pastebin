const NotFound = require('../../errors/notFound');
const ValidationError = require('../../errors/validationError');

class UpdateUserInteractor {
    constructor ({presenter, validator, userFactory, userRepository}) {
        this.presenter = presenter;
        this.validator = validator;
        this.userFactory = userFactory;
        this.userRepository = userRepository;
    }

    async execute({id, name}) {
        const errors = this.validator.validate({id, name});

        if (errors.length > 0) {
            this.presenter.presentFailure(new ValidationError(errors));
            return;
        }

        const user = await this.userRepository.findByID({id});

        if (!user) {
            this.presenter.presentFailure(new NotFound(`User ${id} was not found.`));
            return;
        }
        
        const userEntity = this.userFactory.create({id, name});
        await this.userRepository.save(userEntity);
        this.presenter.presentSuccess();
    }
}

module.exports = UpdateUserInteractor;