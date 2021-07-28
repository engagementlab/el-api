/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * About
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Text,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const marked = require('marked');
const ContentRefreshHook = require('../refreshHook');

const About = cloudinary => {
    /**
     * Model Fields
     * @memberof About
     */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'About Page',
            access: false,
            isRequired: true,
        },
        intro: {
            type: Markdown,
            isRequired: true,
        },
        assumptions: {
            type: Markdown,
            isRequired: true,
        },
        phase1: {
            label: 'Phase 1',
            type: Markdown,
            isRequired: true,
        },
        phase2: {
            label: 'Phase 2',
            type: Markdown,
            isRequired: true,
        },
        phase3: {
            label: 'Phase 3',
            type: Markdown,
            isRequired: true,
        },
        phase1Html: {
            type: Text,
            label: 'The following data is for development purposes.',
            adminConfig: {
                isReadOnly: true,
            },
            adminDoc: 'Phase 1 Render',
        },
        phase2Html: {
            type: Text,
            label: 'Phase 1 Render',
            adminConfig: {
                isReadOnly: true,
            },
        },
        phase3Html: {
            type: Text,
            label: 'Phase 3 Render',
            adminConfig: {
                isReadOnly: true,
            },
        },
    };

    /**
     * Model Options
     * @memberof About
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'About Page',
        plural: 'About',
        singular: 'MIM About',
        path: 'about',
        listQueryName: 'MimAboutPages',
        itemQueryName: 'MimAboutPage',
        adminConfig: {
            defaultColumns: 'label',
        },
        access: {
            create: false,
            delete: false,
        },
    };

    const hooks = {
        // used to force-refresh Gatsby content model on all changes
        beforeChange: ContentRefreshHook,
        resolveInput: async ({
            operation,
            existingItem,
            originalInput,
            resolvedData,
            context,
            listKey,
            fieldPath,
        }) => {
            // Convert applicable markdown fields to HTML
            const renderedData = resolvedData;
            if (renderedData.phase1) renderedData.phase1Html = marked(renderedData.phase1);
            if (renderedData.phase2) renderedData.phase2Html = marked(renderedData.phase2);
            if (renderedData.phase3) renderedData.phase3Html = marked(renderedData.phase3);
            return resolvedData;
        },
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
module.exports = About;