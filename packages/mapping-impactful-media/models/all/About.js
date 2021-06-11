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
const { Markdown, } = require('@keystonejs/fields-markdown');

const {
    CloudinaryImage,
} = require('@keystonejs/fields-cloudinary-image');

const About = cloudinary => {
    /**
     * Model Fields
     * @memberof About
     */
    const fields = {
        name: {
            type: Text,
            efaultValuee: 'About Page',
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

    return {
        fields,
        options,
    };
};

/**
 * Model Registration
 */
module.exports = About;