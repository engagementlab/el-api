/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * GuideEnd
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const { Text, } = require('@keystonejs/fields');
const { Markdown, } = require('@keystonejs/fields-markdown');

const ContentRefreshHook = require('../refreshHook');

const GuideEnd = () => {
    /**
   * Model Fields
   * @memberof GuideEnd
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
        reflect: {
            type: Markdown,
            label: '"Reflect" text',
            isRequired: true,
        },
        readMore: {
            type: Markdown,
            label: '"Read More" text',
            isRequired: true,
        },
        share: {
            type: Markdown,
            label: '"Share with others!" text',
            isRequired: true,
        },
    };
    
    /**
   * Model Options
   * @memberof GuideEnd
   * @see https://www.keystonejs.com/api/create-list
   */
    const options = {
        plural: 'Guide Last Section',
        path: 'guideend',
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
module.exports = GuideEnd;
