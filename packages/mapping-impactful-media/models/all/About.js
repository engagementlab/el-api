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

const {
    CloudinaryImage,
} = require('@keystonejs/fields-cloudinary-image');

const marked = require('marked');

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
        resolveInput: async ({
            operation,
            existingItem,
            originalInput,
            resolvedData,
            context,
            listKey,
            fieldPath,
        }) => {
            const renderedData = resolvedData;
            console.log(renderedData)
            renderedData['phase1'] = marked(renderedData['phase1'])
            return resolvedData
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