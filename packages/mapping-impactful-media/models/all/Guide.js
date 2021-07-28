/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Guide
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const Guide = cloudinary => {
    /**
   * Model Fields
   * @memberof Guide
   */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Guide General Text',
            access: false,
            isRequired: true,
        },
        welcome: {
            type: Markdown,
            label: 'Welcome Text',
            isRequired: true,
        },
        startText1: {
            type: Markdown,
            label: 'Start Text Upper',
            isRequired: true,
        },
        startTextItems: {
            type: Markdown,
            label: 'Start Text Values',
            isRequired: true,
        },
        startText2: {
            type: Markdown,
            label: 'Start Text Lower',
            isRequired: true,
        },
        map: {
            type: Text,
            label: 'Map Help Text',
            isRequired: true,
            isMultiline: true,
        },
        terms: {
            type: Text,
            label: 'Terms Help Text',
            isRequired: true,
            isMultiline: true,
        },
    };

    /**
   * Model Options
   * @memberof Guide
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        label: 'Guide General Text',
        singular: 'Guide General Text',
        plural: 'Guide Text',
        path: 'guidegeneral',
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
module.exports = Guide;
