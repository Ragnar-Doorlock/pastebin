class GetPasteByHashValidator {
    validate ({hash}) {
        const errors = [];

        if (!hash) {
            errors.push('Invalid link.');
        } else {
            if (hash.length < 100) {
                errors.push('Link is too short');
            }
        }
        
        return errors;
    }
}

module.exports = GetPasteByHashValidator;