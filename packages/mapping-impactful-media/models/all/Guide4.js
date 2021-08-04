/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Guide4
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const Guide4 = cloudinary => {
    /**
   * Model Fields
   * @memberof Guide4
   */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'With And Not For Communities',
            access: false,
            isRequired: true,
        },
        intro: {
            type: Markdown,
            isRequired: true,
        },
        introSection2: {
            type: Markdown,
            isRequired: true,
        },
    };

    /**
   * Model Options
   * @memberof Guide4
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        label: 'Guide #4 - With And Not For Communities',
        singular: 'With And Not For Communities',
        plural: 'Guide Section 4',
        path: 'guidesection4',
        access: {
            delete: false,
        },
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
module.exports = Guide4;
