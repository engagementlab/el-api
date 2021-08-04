/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Guide5
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const Guide5 = cloudinary => {
    /**
   * Model Fields
   * @memberof Guide5
   */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Where Do We Stand?',
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
        questions: {
            type: Markdown,
            label: '"Questions to Consider" blurb',
            isRequired: true,
        },
        enabling: {
            type: Markdown,
            label: '"Enabling Environments" intro',
            isRequired: true,
        },
        capacity: {
            type: Markdown,
            label: '"The Capacity To Act" intro',
            isRequired: true,
        },
        margins: {
            type: Markdown,
            label: '"From The Margins To The Middle" intro',
            isRequired: true,
        },
        marginsPrompt: {
            type: Markdown,
            label: '"From The Margins To The Middle" prompt',
            isRequired: true,
        },
    };

    /**
   * Model Options
   * @memberof Guide5
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        label: 'Guide #5 - Where Do We Stand',
        singular: 'Where Do We Stand',
        plural: 'Guide Section 5',
        path: 'guidesection5',
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
module.exports = Guide5;
