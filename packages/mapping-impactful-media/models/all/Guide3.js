/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Guide3
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const Guide3 = cloudinary => {
    /**
   * Model Fields
   * @memberof Guide3
   */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Imagining (More) Inclusive Futures',
            access: false,
            isRequired: true,
        },
        intro: {
            type: Markdown,
            isRequired: true,
        },
        imagination: {
            type: Markdown,
            label: 'Imagination Prompt',
            isRequired: true,
        },
        exercise: {
            type: Markdown,
            label: 'Exercise Intro',
            isRequired: true,
        },
        alternatives: {
            type: Markdown,
            label: '"Imagining Alternatives" blurb',
            isRequired: true,
        },
        voice: {
            type: Markdown,
            label: '"Voice, representation, & connection" blurb',
            isRequired: true,
        },
        voicePrompt: {
            type: Markdown,
            label: '"Voice, representation, & connection" prompt',
            isRequired: true,
        },
        practicing: {
            type: Markdown,
            label: '"Practicing futures" blurb',
            isRequired: true,
        },
        practicingPrompt: {
            type: Markdown,
            label: '"Practicing futures" prompt',
            isRequired: true,
        },
    };

    /**
   * Model Options
   * @memberof Guide3
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        label: 'Guide #3 - Imagining More Inclusive Futures',
        singular: 'Imagining More Inclusive Futures',
        plural: 'Guide Section 3',
        path: 'guidesection3',
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
module.exports = Guide3;
