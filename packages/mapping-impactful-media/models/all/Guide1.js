/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Guide1
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const Guide1 = cloudinary => {
    /**
   * Model Fields
   * @memberof Guide1
   */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Where Do I Stand?',
            access: false,
            isRequired: true,
        },
        intro: {
            type: Markdown,
            isRequired: true,
        },
        standpoint: {
            type: Markdown,
            label: 'Standpoint Prompt',
            isRequired: true,
        },
        resources: {
            type: Markdown,
            label: '"What resources do I have?" text',
            isRequired: true,
        },
        resourcesPrompt: {
            type: Markdown,
            label: '"What resources do I have?" text',
            isRequired: true,
        },
        atStake: {
            type: Markdown,
            label: '"What\'s at stake?" text',
            isRequired: true,
        },
        story: {
            type: Markdown,
            label: '"Story of why?" text',
            isRequired: true,
        },
    };

    /**
   * Model Options
   * @memberof Guide1
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        label: 'Guide #1 - Where Do I Stand',
        singular: 'Where Do I Stand',
        plural: 'Guide Section 1',
        path: 'guidesection1',
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
module.exports = Guide1;
