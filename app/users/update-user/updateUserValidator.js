class UpdateUserValidator {
    validate ({id, name}) {
        const errors = [];

        if (!id && !name) {
            errors.push('ID and name are required.');
        }

        if (id && id.length < 20) {
            errors.push('ID is too short.');
        }

        if (!id) {
            errors.push('ID is required.');
        }

        if (!name) {
            errors.push('Name is required.');
        }

        if (name && name.length === 0) {
            errors.push('Name is required.');
        }

        if (id && !/^user-/.test(id)) {
            errors.push('Invalid ID format.');
        }

        return errors;
    }
}

module.exports = UpdateUserValidator;