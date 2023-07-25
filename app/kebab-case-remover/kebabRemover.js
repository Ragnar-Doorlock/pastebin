class KebabRemover {
    execute(queryResult) {
        const queryKeys = Object.keys(queryResult);
        const camelize = s => s.replace(/_./g, x=>x[1].toUpperCase());
        const queryKeysCamel =  queryKeys.map(camelize);
        const updatedObject = {};
        
        Object.keys(queryResult).forEach((key, index) => {
            const newKey = queryKeysCamel[index];
            updatedObject[newKey] = queryResult[key];
        });

        return updatedObject;
    }
}

module.exports = KebabRemover;