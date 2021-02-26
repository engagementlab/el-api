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
            default: 'About Page',
            hidden: true,
            isRequired: true,

        },
        tagline: {
            type: Text,
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
        singular: 'MIM About',
        path: 'about',
        listQueryName: 'MimAboutPages',
        itemQueryName: 'MimAboutPage',
        adminConfig: {
            defaultColumns: 'label',
        },
        access: {
            create: true,
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