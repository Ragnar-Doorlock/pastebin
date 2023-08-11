class GetUserValidator {
    validate({id}) {
        const errors = [];
        
        if (!id) {
            errors.push('ID is required');
        } else {
            if (!/^user-/.test(id)) {
                errors.push('Invalid ID format');
            }

            if (id.length < 20) {
                errors.push('ID is too short');
            }

            if (id.length > 60) {
                errors.push('ID is too long.');
            }
        }

        return errors;
    }
}

module.exports = GetUserValidator;