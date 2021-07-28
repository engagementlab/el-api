/**
 * Mapping Impactful Media package
 * Developed by Engagement Lab, 2021
 *
 * @author Johnny Richardson
 * Content model refresh hook
 * ==========
 */

const request = require('request');
const ContentRefreshHook = async ({
    operation,
    existingItem,
    originalInput,
    resolvedData,
    context,
    listKey,
    fieldPath,
}) => {
        
    const options = {
        url: 'http://127.0.0.1:8000/__refresh',
        method: 'POST',
    };
        
    function callback(error, response, body) {
        if (!error && response.statusCode === 200)
            console.log(body);
        else
            console.error(error);

        return resolvedData;
    }
            
    request(options, callback);
};
module.exports = ContentRefreshHook;