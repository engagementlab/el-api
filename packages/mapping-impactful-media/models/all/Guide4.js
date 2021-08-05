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

const Guide4 = () => {
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
            label: 'Intro to section 2',
            isRequired: true,
        },
        questions: {
            type: Markdown,
            label: '"Questions to Consider" prompt',
            isRequired: true,
        },
        communities: {
            type: Markdown,
            label: '"Learning About Communities" text',
            isRequired: true,
        },
        media: {
            type: Markdown,
            label: '"Media And Communities" blurb',
            isRequired: true,
        },
        mediaPrompt1: {
            type: Markdown,
            label: '"Media representation" prompt',
            isRequired: true,
        },
        mediaPrompt2: {
            type: Markdown,
            label: '"Media use" prompt',
            isRequired: true,
        },
        withNotFor: {
            type: Markdown,
            label: '"With (And Not For) Communities?" text',
            isRequired: true,
        },
        withNotForPrompt: {
            type: Markdown,
            label: '"Hearing Diverse Voices" text',
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
module.exports = Guide4;
