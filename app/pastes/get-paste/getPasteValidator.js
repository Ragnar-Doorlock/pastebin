class GetPasteValidator {
    validate({id}) {
        const errors = []
        
        if (!id) {
            errors.push('ID is required.');
        } else {
            if (id.length < 20) {
                errors.push('ID is too short');
            }

            if (!/^paste-/.test(id)) {
                errors.push('Invalid ID format');
            }

            if (id.length > 60) {
                errors.push('ID is too long.');
            }
        }

        return errors;
    }
}

module.exports = GetPasteValidator;