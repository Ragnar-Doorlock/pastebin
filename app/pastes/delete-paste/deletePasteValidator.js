class DeletePasteValidator {
    validate ({id}) {
        const errors = [];

        if (!id) {
            errors.push('ID is required.');
        }

        if (id && !/^paste-/.test(id)) {
            errors.push('Invalid ID format.');
        }

        if (id && id.length < 20) {
            errors.push('ID is too short.');
        }

        return errors;
    }
}

module.exports = DeletePasteValidator;