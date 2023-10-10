/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Guide2
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const Guide2 = () => {
    /**
   * Model Fields
   * @memberof Guide2
   */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Who Cares?',
            access: false,
            isRequired: true,
        },
        intro: {
            type: Markdown,
            isRequired: true,
        },
        caring: {
            type: Markdown,
            label: '"Caring About v. Caring For" text',
            isRequired: true,
        },
        caringBlurb: {
            type: Markdown,
            label: '"Caring About" column text',
            isRequired: true,
        },
        caringForBlurb: {
            type: Markdown,
            label: '"Caring For" column text',
            isRequired: true,
        },
        caringWith: {
            type: Markdown,
            label: '"Caring With Others" text',
            isRequired: true,
        },
        caringWithPrompt: {
            type: Markdown,
            label: '"Statement on caring with" prompt',
            isRequired: true,
        },
        careful: {
            type: Markdown,
            label: '"Care(ful) Statements" text',
            isRequired: true,
        },
        carefulPrompt: {
            type: Markdown,
            label: '"Caring Ladder" prompt',
            isRequired: true,
        },
        learningGuide: {
            type: Markdown,
            label: '"It\'s Your Turn" text',
            isRequired: true,
        },
    };

    /**
   * Model Options
   * @memberof Guide2
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        label: 'Guide #2 - Who Cares',
        singular: 'Who Cares',
        plural: 'Guide Section 2',
        path: 'guidesection2',
        access: {
            create: false,
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
module.exports = Guide2;
