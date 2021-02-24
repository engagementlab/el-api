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
    CloudinaryImage,
} = require('@keystonejs/fields');

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
        singular: 'MIM About Page',
        path: 'about',
        listQueryName: 'MimAboutPage',
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