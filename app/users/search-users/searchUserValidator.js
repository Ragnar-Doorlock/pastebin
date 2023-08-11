class SearchUserValidator {
    validate ({id, name}) {
        const errors = [];

        if (Array.isArray(id)) {
            for (const i of id) {
                if (i.length < 20) {
                    errors.push(`ID ${i} is too short.`);
                }
            }
        } else {
            if (id && id.length < 20) {
                errors.push('ID is too short.');
            }
        }

        if (name && name.length === 0) {
            errors.push('Name value is invalid.');
        }

        if (id && !/^user-/.test(id)) {
            errors.push('Invalid ID format.');
        }

        return errors;
    }
}

module.exports = SearchUserValidator;