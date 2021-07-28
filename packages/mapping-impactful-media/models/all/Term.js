/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Term
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Text,
} = require('@keystonejs/fields');
const ContentRefreshHook = require('../refreshHook');

const Term = cloudinary => {
    /**
     * Model Fields
     * @memberof Home
     */
    const fields = {
        name: {
            type: Text,
            label: 'Question',
        },
        answer: {
            type: Text,
            isMultiline: true,
        },
    };

    /**
     * Model Options
     * @memberof Home
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
    };

    const hooks = {
        // used to force-refresh Gatsby content model on all changes
        beforeChange: ContentRefreshHook,
    };

    return {
        hooks,
        fields,
        options,
    };
};

/**
 * Model Registration
 */
module.exports = Term;