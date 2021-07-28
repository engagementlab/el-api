/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * TermsPage
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Relationship,
    Text,
} = require('@keystonejs/fields');
const ContentRefreshHook = require('../refreshHook');

const TermsPage = cloudinary => {
    /**
     * Model Fields
     * @memberof TermsPage
     */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Terms Page',
            access: false,
            isRequired: true,
        },
        terms: {
            type: Relationship,
            ref: 'Term',
            many: true,
        },
    };

    /**
     * Model Options
     * @memberof TermsPage
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'Terms Page',
        plural: 'Guide Terms Page',
        path: 'terms-page',
        // singular: 'MIM About',
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
module.exports = TermsPage;