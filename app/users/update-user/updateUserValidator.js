class UpdateUserValidator {
    validate ({id, name}) {
        const errors = [];

        if (!id) {
            errors.push('ID is required.');
        } else {
            if (!/^user-/.test(id)) {
                errors.push('Invalid ID format.');
            }

            if (id.length < 20) {
                errors.push('ID is too short.');
            }
        }

        if (!name) {
            errors.push('Name is required.');
        } else {
            if (name.length === 0) {
                errors.push('Name is required.');
            }

            if (name.length > 50) {
                errors.push('Name value is over 50 characters.');
            }
        }
        
        return errors;
    }
}

module.exports = UpdateUserValidator;