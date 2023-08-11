class SearchUrlValidator {
    validate({pasteId, hash}) {
        const errors = [];

        if (pasteId && !/^paste-/.test(pasteId)) {
            errors.push('Invalid paste ID format.');
        }

        if (Array.isArray(pasteId)) {
            for (const i of pasteId) {
                if (i.length < 20) {
                    errors.push(`ID ${i} is too short.`);
                }
            }
        } else {
            if (pasteId && pasteId.length < 20) {
                errors.push('ID is too short.');
            }
        }

        return errors;
    }
}
module.exports = SearchUrlValidator;