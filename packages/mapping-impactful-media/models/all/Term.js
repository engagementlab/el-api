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

    return {
        fields,
        options,
    };
};

/**
 * Model Registration
 */
module.exports = Term;